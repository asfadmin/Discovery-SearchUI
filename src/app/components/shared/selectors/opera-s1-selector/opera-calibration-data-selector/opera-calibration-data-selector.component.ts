import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as filterStore from '@store/filters'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-opera-calibration-data-selector',
  templateUrl: './opera-calibration-data-selector.component.html',
  styleUrls: ['./opera-calibration-data-selector.component.scss']
})
export class OperaCalibrationDataSelectorComponent implements OnInit, OnDestroy{
  public includeCalibrationData = false;

  constructor(
    private store$: Store<AppState>,
  ) {}

  private subs = new SubSink();

  public ngOnInit(): void {
    this.subs.add(this.store$.select(filterStore.getIncludeCalibrationData).subscribe(
      includeCalibrationData => this.includeCalibrationData = includeCalibrationData
    ));
  }

  public onToggle(event: MatSlideToggleChange): void {
    this.includeCalibrationData = event.checked;
    this.store$.dispatch(new filterStore.setIncludeCalibrationData(this.includeCalibrationData))
  }
  public ngOnDestroy() {
    this.subs.unsubscribe()
  }
  
}
