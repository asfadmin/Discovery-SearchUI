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
  public radiometry: models.RtcGammaRadiometry;
  public scale: models.RtcGammaScale;
  public demMatching: boolean;
  public includeDem: boolean;
  public includeIncMap: boolean;
  public speckleFilter: boolean;
  public includeScatteringArea: boolean;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => {
        this.radiometry = options.radiometry;
        this.scale = options.scale;
        this.demMatching = options.demMatching;
        this.includeDem = options.includeDem;
        this.includeIncMap = options.includeIncMap;
        this.speckleFilter = options.speckleFilter;
        this.includeScatteringArea = options.includeScatteringArea;
      }
    );
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

  public onSetIncludeScatteringArea(includeScatteringArea: boolean): void {
    this.includeScatteringArea = includeScatteringArea;
    this.updateProcessingOptions();
  }

  public onSetIncludeIncMap(includeIncMap: boolean): void {
    this.includeIncMap = includeIncMap;
    this.updateProcessingOptions();
  }

  public onSetIncludeDem(includeDem: boolean): void {
    this.includeDem = includeDem;
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
      includeScatteringArea: this.includeScatteringArea,
      speckleFilter: this.speckleFilter,
    }));
  }
}
