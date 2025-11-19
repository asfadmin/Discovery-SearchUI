import { Component, OnInit, Input, ViewChild, inject } from '@angular/core';
import {
  MatMenu,
  MatMenuContent,
  MatMenuItem,
  MatMenuTrigger,
} from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as userStore from '@store/user';
import * as hyp3Store from '@store/hyp3';
import * as uiStore from '@store/ui';

import * as models from '@models';
import { SubSink } from 'subsink';
import { getMasterName, getScenes } from '@store/scenes';
import { getSearchType } from '@store/search';
import { CMRProduct, Hyp3ableByProductType, SearchType } from '@models';
import { withLatestFrom } from 'rxjs/operators';
import { EnvironmentService, Hyp3ApiService } from '@services';
import {
  getSelectedDataset,
  getShouldUseFramesForReference,
} from '@store/filters';
import {
  NgIf,
  NgFor,
  NgPlural,
  NgPluralCase,
  DecimalPipe,
} from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-on-demand-add-menu',
  templateUrl: './on-demand-add-menu.component.html',
  styleUrls: ['./on-demand-add-menu.component.scss'],
  imports: [
    MatMenu,
    MatMenuContent,
    NgIf,
    MatMenuItem,
    NgFor,
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    NgPlural,
    NgPluralCase,
    DecimalPipe,
    TranslateModule,
  ],
})
export class OnDemandAddMenuComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  env = inject(EnvironmentService);
  hyp3 = inject(Hyp3ApiService);

  @Input() hyp3ableProducts: models.Hyp3ableProductByJobType;
  @Input() isExpired = false;
  @Input() expiredJobs: models.Hyp3Job;

  @ViewChild('addMenu', { static: true }) addMenu: MatMenu;

  public isLoggedIn = false;

  public referenceScene: CMRProduct;

  private scenes: CMRProduct[];
  public costs;
  public options;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  public isFrameBased = false;
  private referenceID: string;
  public userStatus;

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(getShouldUseFramesForReference)
        .subscribe((isFrameBased) => (this.isFrameBased = isFrameBased)),
    );
    this.subs.add(
      this.store$
        .select(getSearchType)
        .subscribe((searchtype) => (this.searchType = searchtype)),
    );

    this.subs.add(
      this.store$
        .select(userStore.getIsUserLoggedIn)
        .subscribe((isLoggedIn) => (this.isLoggedIn = isLoggedIn)),
    );

    this.subs.add(
      this.store$
        .select(hyp3Store.getCosts)
        .subscribe((costs) => (this.costs = costs)),
    );

    this.subs.add(
      this.store$
        .select(hyp3Store.getProcessingOptions)
        .subscribe((options) => (this.options = options)),
    );
    this.subs.add(
      this.store$.select(hyp3Store.getHyp3User).subscribe((profile) => {
        this.userStatus = profile?.application_status;
      }),
    );

    this.subs.add(
      this.store$
        .select(getMasterName)
        .subscribe((sceneName) => (this.referenceID = sceneName)),
    );
    this.subs.add(
      this.store$
        .select(getScenes)
        .pipe(
          withLatestFrom(this.store$.select(getMasterName)),
          withLatestFrom(this.store$.select(getSelectedDataset)),
        )
        .subscribe(([[scenes, referenceName], dataset]) => {
          this.scenes = scenes;
          this.referenceID = referenceName;
          if (
            referenceName &&
            dataset.id !== 'SENTINEL-1 INTERFEROGRAM (BETA)'
          ) {
            const referenceSceneIdx = this.scenes.findIndex(
              (scene) => scene.name === referenceName,
            );
            if (referenceSceneIdx !== -1) {
              this.referenceScene = this.scenes[referenceSceneIdx];
            }
          }
        }),
    );
  }

  public queueAllOnDemand(
    products: models.CMRProduct[][],
    job_type: models.Hyp3JobType,
    isFrameBased = false,
  ): void {
    const jobs: models.QueuedHyp3Job[] = products.map((product) => ({
      granules: [...product].sort((a, b) => {
        if (a.metadata.date < b.metadata.date) {
          return -1;
        }
        return 1;
      }),
      job_type,
      reference_id: isFrameBased ? this.referenceID : null,
    }));

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public isBaselineStack(
    byProductType: Hyp3ableByProductType[],
    searchType: SearchType,
  ) {
    if (searchType !== this.searchTypes.BASELINE) {
      return false;
    }
    const slcProducts = this.findSLCs(byProductType).products;

    return slcProducts.length >= 1 && this.isNotReferenceScene(slcProducts);
  }

  private findSLCs(
    byProductType: Hyp3ableByProductType[],
  ): Hyp3ableByProductType {
    return byProductType.find(
      (prod) => prod.productType === 'SLC' || prod.productType === 'BURST',
    );
  }

  private isNotReferenceScene(products: CMRProduct[][]): boolean {
    return (
      products[0][0].id !== this.referenceScene.id ||
      products[products.length - 1][0].id !== this.referenceScene.id
    );
  }

  public queueBaselinePairOnDemand(
    products: models.CMRProduct[][],
    job_type: models.Hyp3JobType,
  ) {
    products = products.filter((prod) => prod[0].id !== this.referenceScene.id);
    const jobs: models.QueuedHyp3Job[] = products.map((product) => {
      return {
        granules: [this.referenceScene, product[0]]?.sort((a, b) => {
          if (a.metadata.date < b.metadata.date) {
            return -1;
          }
          return 1;
        }),
        job_type,
      } as models.QueuedHyp3Job;
    });

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public calculateCost(jobTypeId: string, numberOfJobs: number): number {
    return (
      this.hyp3.calculateCredits(
        this.options[jobTypeId],
        this.costs[jobTypeId],
      ) * numberOfJobs
    );
  }

  public onOpenHelp(infoUrl: string) {
    window.open(infoUrl);
  }
  public onOpenSignup(): void {
    this.store$.dispatch(new uiStore.SetIsOnDemandQueueOpen(true));
  }
}
