import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';


import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as hyp3Store from '@store/hyp3';

import { Hyp3Service, NotificationService } from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { catchError, filter, finalize } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { SearchType } from '@models';
import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.scss']
})
export class SceneFileComponent implements OnInit, OnDestroy {
  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() isUnzipLoading: boolean;
  @Input() isOpen: boolean;
  @Input() isUserLoggedIn: boolean;
  @Input() validHyp3JobTypes: models.Hyp3JobType[];
  @Input() hasAccessToRestrictedData: boolean;
  @Input() loadingHyp3JobName: string | null;

  @Output() toggle = new EventEmitter<void>();
  @Output() unzip = new EventEmitter<models.CMRProduct>();
  @Output() closeProduct = new EventEmitter<models.CMRProduct>();
  @Output() queueHyp3Job = new EventEmitter<models.QueuedHyp3Job>();

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = SearchType;
  public isHovered = false;
  public paramsList = [];

  private projectName = '';

  private subs = new SubSink;

  constructor(
      private hyp3: Hyp3Service,
      private store$: Store<AppState>,
      private notificationService: NotificationService,
      private dialog: MatDialog,
    ) {}

  ngOnInit() {
    this.subs.add(
        of(this.product).pipe(
          filter(prod => !!prod.metadata)
        ).subscribe( prod => {
          this.paramsList = this.jobParamsToList(prod.metadata);
        }
      )
      );
  }

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }

  public onLoadUnzippedPoduct(): void {
    if (!this.isUserLoggedIn) {
      return;
    }

    this.unzip.emit(this.product);
  }

  public onCloseProduct(): void {
    this.closeProduct.emit(this.product);
  }

  public isUnzipDisabled(isLoggedIn: boolean, hasAccess: boolean): boolean {
    return (
      !isLoggedIn ||
      (this.isRestrictedDataset() && !hasAccess)
    );
  }

  private isRestrictedDataset(): boolean {
    return (
      this.product.dataset.includes('RADARSAT-1') ||
      this.product.dataset.includes('JERS-1')
    );
  }

  public unzipTooltip(isLoggedIn: boolean, hasAccess: boolean): string {
    if (!isLoggedIn) {
      return 'Login to view contents';
    }

    if (this.isRestrictedDataset() && !hasAccess) {
      return 'Cannot view restricted dataset';
    }

    return 'View file contents';
  }

  public canUnzip(product: models.CMRProduct): boolean {
    const dataset = product.dataset.toLowerCase();

    return (
      (
        !dataset.includes('sentinel') ||
        dataset === 'sentinel-1 interferogram (beta)'
      ) &&
      product.downloadUrl.endsWith('.zip')
    );
  }

  public expirationBadge(expiration_time: moment.Moment): string {
    const days = this.expirationDays(expiration_time);

    const plural = days === 0 ? '' : 's';

    return days > 0 ? `(Expires: ${days} Day${plural})` : '';
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3.isDownloadable(product);
  }

  public addJobToProcessingQueue(jobType: models.Hyp3JobType): void {
    this.queueHyp3Job.emit({
      granules: [ this.product ],
      job_type: jobType
    });
  }

  public queueExpiredHyp3Job() {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id => {
        return this.product.metadata.job.job_type === id as any;
      });

    this.store$.dispatch(new queueStore.AddJob({
      granules: this.product.metadata.job.job_parameters.scenes,
      job_type: job_types[job_type]
    }));
  }

  public jobParamsToList(metadata) {
    if (!metadata.job) {
      return [];
    }

    const jobType = models.hyp3JobTypes[metadata.job.job_type];
    const options = !!jobType ? jobType.options : models.hyp3JobOptionsOrdered;

    return options
      .filter(option => metadata.job.job_parameters[option.apiName])
      .map(option => {
        return {name: option.name, val: metadata.job.job_parameters[option.apiName]};
      });
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }

  public onOpenHelp(e: Event, infoUrl: string) {
    e.stopPropagation();
    window.open(infoUrl);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  public onReviewQueue() {

    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      {
        return this.product.metadata.job.job_type === id as any;
      });

      // this.scene.metadata.job.job_parameters

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
          granules: this.product.metadata.job.job_parameters.scenes,
          job_type: job_types[job_type]
        } as models.QueuedHyp3Job ]
      }]
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        // if (this.env.maturity === 'prod') {
        //   this.validateOnly = false;
        // }

        this.onSubmitQueue(
          jobTypesWithQueued,
          false,
        );
      }
    );
  }

  public onSubmitQueue(jobTypesWithQueued, validateOnly: boolean) {
    console.log(this.product.metadata.job);
    console.log(jobTypesWithQueued);
    console.log(validateOnly);

    // console.log(this.processingOptions);

    const processOptionKeys = Object.keys(this.product.metadata.job.job_parameters).filter(key => key !== 'granules');
    let processingOptions = {};
    processOptionKeys.forEach(key => processingOptions[key] = this.product.metadata.job.job_parameters[key]);
    // let processingOptions = {[key in processOptionKeys]: this.scene.metadata.job[key]};
    const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions
    });

    this.hyp3.submiteJobBatch$({jobs: hyp3JobsBatch, validate_only: true}).pipe(
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
      }),
    ).subscribe(
      (resp: any) => {
        if (resp.jobs === null) {
          return;
        }
        console.log(resp);

        // const successfulJobs = resp.jobs.map(job => ({
        //   granules: job.job_parameters.granules.map(g => ({name: g})),
        //   job_type: models.hyp3JobTypes[job.job_type]
        // }));

        // this.store$.dispatch(new queueStore.RemoveJobs(successfulJobs));
      }
    );
    // const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
    //   projectName: this.projectName,
    //   processingOptions: this.processingOptions
  // });
  }


  public isExpired(job: models.Hyp3Job): boolean {
    return this.hyp3.isExpired(job);
  }
}
