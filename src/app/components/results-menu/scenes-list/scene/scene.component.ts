import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import * as services from '@services';
import * as models from '@models';

import { QueuedHyp3Job, Hyp3ableProductByJobType } from '@models';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

import * as queueStore from '@store/queue';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {
  @Input() scene: models.CMRProduct;
  @Input() searchType: models.SearchType;

  @Input() isSelected: boolean;
  @Input() offsets: {temporal: number, perpendicular: number} = {temporal: 0, perpendicular: null};

  @Input() isQueued: boolean;
  @Input() jobQueued: boolean;
  @Input() numQueued: number;
  @Input() hyp3ableByJobType: { total: number, byJobType: models.Hyp3ableProductByJobType[]};

  @Output() zoomTo = new EventEmitter();
  @Output() toggleScene = new EventEmitter();
  @Output() ToggleOnDemandScene: EventEmitter<QueuedHyp3Job> = new EventEmitter();

  public hovered: boolean;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  public copyIcon = faCopy;
  public SearchTypes = models.SearchType;

  constructor(
    public env: services.EnvironmentService,
    private screenSize: services.ScreenSizeService,
    private hyp3: services.Hyp3Service,
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );
  }

  public onSetFocused(): void {
    this.hovered = true;
  }

  public onClearFocused(): void {
    this.hovered = false;
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
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3.isDownloadable(product);
  }

  public queueExpiredHyp3Job() {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id => {
        return this.scene.metadata.job.job_type === id as any;
      });

    this.store$.dispatch(new queueStore.AddJob({
      granules: this.scene.metadata.job.job_parameters.scenes,
      job_type: job_types[job_type]
    }));
  }

  public getExpiredHyp3ableObject(): {byJobType: models.Hyp3ableProductByJobType[], total: number} {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id => {
        return this.scene.metadata.job.job_type === id as any;
      });

    const byJobType: Hyp3ableProductByJobType[] = [];

    const temp: models.Hyp3ableByProductType = {
      productType: this.scene.metadata.job.job_type as any,
      products: [this.scene.metadata.job.job_parameters.scenes]
    };

    const byProductType: models.Hyp3ableByProductType[] = [];
    byProductType.push(temp);

    const hyp3ableProduct = {
      byProductType,
      total: 1,
      jobType: job_types[job_type]
    } as models.Hyp3ableProductByJobType;

    byJobType.push(hyp3ableProduct);

    const output = {
      byJobType,
      total: 1
    } as {byJobType: models.Hyp3ableProductByJobType[], total: number};

    return output;
  }

  public isExpired(job: models.Hyp3Job): boolean {
    if (job == null) {
      return false;
    }
    return this.hyp3.isExpired(job);
  }
}
