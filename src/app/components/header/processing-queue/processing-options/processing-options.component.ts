import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';

import * as models from '@models';

@Component({
  selector: 'app-processing-options',
  templateUrl: './processing-options.component.html',
  styleUrls: ['./processing-options.component.scss']
})
export class ProcessingOptionsComponent implements OnInit {
  public projectName = '';

  public processingType = 'RTC_GAMMA';
  public radiometry = models.RtcGammaRadiometry.GAMMA0;
  public scale = models.RtcGammaScale.POWER;
  public demMatching = false;
  public includeDem = false;
  public includeIncMap = false;
  public speckleFilter = false;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  public onSetProcessingType(processingType: string): void {
    this.processingType = processingType;
  }

  public onProjectNameChange(projectName: string): void {
    this.store$.dispatch(new hyp3Store.SetProcessingProjectName(projectName));
  }

  public onSetRadiometry(radiometry: models.RtcGammaRadiometry): void {
    this.radiometry = radiometry;
    this.updateProcessingOptions();
  }

  public onSetScale(scale: models.RtcGammaScale): void {
    this.scale = scale;
    this.updateProcessingOptions();
  }

  public onSetDemMatching(demMatching: boolean): void {
    this.demMatching = demMatching;
    this.updateProcessingOptions();
  }

  public onSetIncludeDem(includeDem: boolean): void {
    this.includeDem = includeDem;
    this.updateProcessingOptions();
  }

  public onSetIncludeIncMap(includeIncMap: boolean): void {
    this.includeIncMap = includeIncMap;
    this.updateProcessingOptions();
  }

  public onSetSpeckleFilter(speckleFilter: boolean): void {
    this.speckleFilter = speckleFilter;
    this.updateProcessingOptions();
  }

  private updateProcessingOptions(): void {
    this.store$.dispatch(new hyp3Store.SetProcessingOptions({
      radiometry: this.radiometry,
      scale: this.scale,
      demMatching: this.demMatching,
      includeDem: this.includeDem,
      includeIncMap: this.includeIncMap,
      speckleFilter: this.speckleFilter,
    }));
  }
}
