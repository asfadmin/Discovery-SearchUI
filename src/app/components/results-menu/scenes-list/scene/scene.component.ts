import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

import * as services from '@services';
import * as models from '@models';
import { QueuedHyp3Job } from '@models';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  @Input() scene: models.CMRProduct;
  @Input() searchType: models.SearchType;

  @Input() isHovered: boolean;
  @Input() isSelected: boolean;
  @Input() offsets: {temporal: 0, perpendicular: number};

  @Input() isQueued: boolean;
  @Input() jobQueued: boolean;
  @Input() numQueued: number;

  @Output() zoomTo = new EventEmitter();
  @Output() toggleScene = new EventEmitter();
  @Output() ToggleOnDemandScene: EventEmitter<QueuedHyp3Job> = new EventEmitter();

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  constructor(
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );
  }

  public withOffset(val: number, offset: number): number {
    return Math.trunc(val + offset);
  }

  public onZoomTo(): void {
    this.zoomTo.emit();
  }

  public onToggleScene(): void {
    this.toggleScene.emit();
  }

  public onToggleOnDemandScene(): void {
    this.ToggleOnDemandScene.emit({
      granules: [ this.scene ],
      job_type: models.hyp3JobTypes.RTC_GAMMA
    } as QueuedHyp3Job);
    this.jobQueued = !this.jobQueued;
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

  public isProcessable(product: models.CMRProduct): boolean {
    return (
      product.metadata.beamMode === 'IW' &&
      (
        product.metadata.productType === 'GRD_HD' ||
        product.metadata.productType === 'GRD-HS' ||
        product.metadata.productType === 'SLC'
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

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }
}
