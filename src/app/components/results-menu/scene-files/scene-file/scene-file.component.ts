import { Component, Input, Output, EventEmitter } from '@angular/core';

import * as moment from 'moment';

import * as models from '@models';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.scss']
})
export class SceneFileComponent {
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

  public isHovered = false;

  constructor() {}

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
    return (
      !product.metadata.job ||
      (
        !this.isPending(product.metadata.job) &&
        !this.isFailed(product.metadata.job) &&
        !this.isRunning(product.metadata.job) &&
        !this.isExpired(product.metadata.job)
      )
    );
  }

  public isExpired(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.SUCCEEDED &&
      this.expirationDays(job.expiration_time) <= 0;
  }

  public isFailed(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.FAILED;
  }

  public isPending(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.PENDING;
  }

  public isRunning(job: models.Hyp3Job): boolean {
    return job.status_code === models.Hyp3JobStatusCode.RUNNING;
  }

  public addRtcToProcessingQueue(): void {
    this.queueHyp3Job.emit({
      granules: [ this.product ],
      job_type: models.hyp3JobTypes.RTC_GAMMA
    });
  }

  public addJobToProcessingQueue(jobType: models.Hyp3JobType): void {
    this.queueHyp3Job.emit({
      granules: [ this.product ],
      job_type: jobType
    });
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }
}
