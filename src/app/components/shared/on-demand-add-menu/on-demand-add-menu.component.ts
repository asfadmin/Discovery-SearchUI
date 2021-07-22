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
import { catchError, finalize, first, withLatestFrom } from 'rxjs/operators';
import { CreateSubscriptionComponent } from '../../header/create-subscription';
import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';
import { EnvironmentService, Hyp3Service, NotificationService } from '@services';
import { of } from 'rxjs';

@Component({
  selector: 'app-on-demand-add-menu',
  templateUrl: './on-demand-add-menu.component.html',
  styleUrls: ['./on-demand-add-menu.component.scss']
})
export class OnDemandAddMenuComponent implements OnInit {
  @Input() hyp3ableProducts: models.Hyp3ableProductByJobType;
  @Input() isExpired: boolean = false;
  @Input() expiredJobs: models.Hyp3Job;

  @ViewChild('addMenu', {static: true}) addMenu: MatMenu;

  public referenceScene: CMRProduct;
  private scenes: CMRProduct[];

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public InSAR = models.hyp3JobTypes.INSAR_GAMMA;
  public AutoRift = models.hyp3JobTypes.AUTORIFT;

  private projectName = '';
  private validateOnly = false;

  public remaining = 0;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    public env: EnvironmentService,
    private hyp3: Hyp3Service,
    private notificationService: NotificationService,
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

    this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
      projectName => this.projectName = projectName
    );

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.remaining = user.quota.remaining;
      }
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
    this.dialog.open(CreateSubscriptionComponent, {
      id: 'subscriptionQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }

  public onOpenHelp(infoUrl) {
    window.open(infoUrl);
  }

  public onReviewExpiredJob() {

    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      this.expiredJobs.job_type === id as any);

    const confirmationRef = this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: [{
        jobType: job_types[job_type],
        selected: true,
        jobs: [{
          granules: this.expiredJobs.job_parameters.scenes,
          job_type: job_types[job_type]
        } as models.QueuedHyp3Job ]
      }]
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        if (this.env.maturity === 'prod') {
          this.validateOnly = false;
        }

        this.onResubmitExpiredJob(
          jobTypesWithQueued,
          this.validateOnly
        );
      }
    );
  }

  public onResubmitExpiredJob(jobTypesWithQueued, validateOnly: boolean) {

    const processOptionKeys = Object.keys(this.expiredJobs.job_parameters).filter(key => key !== 'granules');
    let processingOptions = {};
    processOptionKeys.forEach(key => processingOptions[key] = this.expiredJobs.job_parameters[key]);

    const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions
    });

    this.hyp3.submiteJobBatch$({jobs: hyp3JobsBatch, validate_only: validateOnly}).pipe(
      catchError(resp => {
        if (resp.error) {
          if (resp.error.detail === 'No authorization token provided' || resp.error.detail === 'Provided apikey is not valid') {
            this.notificationService.error('Your authorization has expired. Please sign in again.', 'Error', {
              timeOut: 5000,
          });
          } else {
            this.notificationService.error( resp.error.detail, 'Error', {
              timeOut: 5000,
            });
          }
        }

        return of({jobs: null});
      }),
      finalize(() => {
        this.store$.dispatch(new hyp3Store.LoadUser());

        let jobText;
        const submittedJobs = Math.abs(hyp3JobsBatch.length);
        jobText = submittedJobs > 1 ? `${submittedJobs} Jobs` : 'Job';
        if (jobText) {
          this.notificationService.info(`${submittedJobs} expired ${jobText} submitted for re-processing.`,
          `Expired ${jobText} Submitted`,
          {
            closeButton: true,
            disableTimeOut: true,
          })
        }
      }),
      first(),
    ).subscribe();
  }
}
