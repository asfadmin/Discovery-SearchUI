import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';

import { EnvironmentService, Hyp3Service, OnDemandService } from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { SearchType } from '@models';

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

  private subs = new SubSink();

  constructor(
      private hyp3: Hyp3Service,
      private store$: Store<AppState>,
      public env: EnvironmentService,
      private onDemand: OnDemandService,
    ) {}

  ngOnInit() {
    this.subs.add(
        of(this.product).pipe(
          filter(prod => !!prod.metadata)
        ).subscribe( prod => {

          if (!prod.metadata.job) {
            this.paramsList = [];
          } else {
            this.paramsList = this.onDemand.jobParamsToList(prod.metadata);
          }
        }
      )
    );

  }

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }

  public onLoadUnzippedProduct(): void {
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

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }

  public onOpenHelp(e: Event, infoUrl: string) {
    e.stopPropagation();
    window.open(infoUrl);
  }

  public isExpired(job: models.Hyp3Job): boolean {
    if (job) {
      return this.hyp3.isExpired(job);
    }
    return false;
  }

  public prodDownloaded( _product ) {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
