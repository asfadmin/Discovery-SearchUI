import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';

import * as models from '@models';
import { SubSink } from 'subsink';
import { getMasterName, getScenes } from '@store/scenes';
import { getSearchType } from '@store/search';
import { CMRProduct, Hyp3ableByProductType, SearchType } from '@models';
import { withLatestFrom } from 'rxjs/operators';
import { CreateSubscriptionComponent } from '../../header/create-subscription';
import { EnvironmentService } from '@services';

@Component({
  selector: 'app-on-demand-add-menu',
  templateUrl: './on-demand-add-menu.component.html',
  styleUrls: ['./on-demand-add-menu.component.scss']
})
export class OnDemandAddMenuComponent implements OnInit {
  @Input() hyp3ableProducts: models.Hyp3ableProductByJobType;
  @Input() isExpired = false;
  @Input() expiredJobs: models.Hyp3Job;
  @Input() showSubscriptions = false;

  @ViewChild('addMenu', {static: true}) addMenu: MatMenu;

  public referenceScene: CMRProduct;
  private scenes: CMRProduct[];

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    public env: EnvironmentService,
  ) { }

  ngOnInit(): void {

    this.subs.add(
      this.store$.select(getSearchType).subscribe( searchtype => this.searchType = searchtype)
    );

    this.subs.add(
      this.store$.select(getScenes).pipe(
        withLatestFrom(this.store$.select(getMasterName))
        ).subscribe(
        ([scenes, referenceName]) => {
          this.scenes = scenes;
          if (!!referenceName) {
            const referenceSceneIdx = this.scenes.findIndex(scene => scene.name === referenceName);
            if (referenceSceneIdx !== -1) {
              this.referenceScene = this.scenes[referenceSceneIdx];
            }
          }
        }
      )
    );
  }

  public queueAllOnDemand(products: models.CMRProduct[][], job_type: models.Hyp3JobType): void {
    const jobs: models.QueuedHyp3Job[] = products.map(product => ({
      granules: product,
      job_type
    }));

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public isBaselineStack(byProductType: Hyp3ableByProductType[], searchType: SearchType) {
    if (searchType !== this.searchTypes.BASELINE) {
      return false;
    }
    const slcProducts = this.findSLCs(byProductType).products;

    return slcProducts.length >= 1 &&
    this.isNotReferenceScene(slcProducts);
  }

  private findSLCs(byProductType: Hyp3ableByProductType[]): Hyp3ableByProductType {
    return byProductType.find(prod => prod.productType === 'SLC');
  }

  private isNotReferenceScene(products: CMRProduct[][]): boolean {
    return products[0][0].id !== this.referenceScene.id ||
    products[products.length - 1][0].id !== this.referenceScene.id;
  }

  public queueBaselinePairOnDemand(products: models.CMRProduct[][], job_type: models.Hyp3JobType) {
    products = products.filter(prod => prod[0].id !== this.referenceScene.id);
    const jobs: models.QueuedHyp3Job[] = products.map(product => {
      return {
      granules: [this.referenceScene, product[0]],
      job_type
    } as models.QueuedHyp3Job;
  });

    this.store$.dispatch(new queueStore.AddJobs(jobs));
  }

  public onOpenCreateSubscription() {
    const ref = this.dialog.open(CreateSubscriptionComponent, {
      id: 'subscriptionQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        referenceScene: this.referenceScene
      }
    });

    ref.afterClosed().subscribe(
      _ => {
        this.store$.dispatch(new hyp3Store.LoadSubscriptions());
      }
    );
  }

  public onOpenHelp(infoUrl) {
    window.open(infoUrl);
  }
}
