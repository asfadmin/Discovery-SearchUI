import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';

import { Hyp3Service } from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  public isHovered = false;
  public paramsList = [];

  private subs = new SubSink;

  constructor(private hyp3: Hyp3Service,
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
}
