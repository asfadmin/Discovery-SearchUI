import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as filterStore from '@store/filters';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-opera-calibration-data-selector',
  templateUrl: './opera-calibration-data-selector.component.html',
  styleUrls: ['./opera-calibration-data-selector.component.scss']
})
export class OperaCalibrationDataSelectorComponent implements OnInit, OnDestroy{
  public useCalibrationData = false;

  constructor(
    private store$: Store<AppState>,
  ) {}

  private subs = new SubSink();

  public ngOnInit(): void {
    this.subs.add(this.store$.select(filterStore.getUseCalibrationData).subscribe(
      useCalibrationData => this.useCalibrationData = useCalibrationData
    ));
  }

  public onToggle(event: MatRadioChange): void {
    this.useCalibrationData = event.value;
    this.store$.dispatch(new filterStore.setUseCalibrationData(this.useCalibrationData))
  }
  public ngOnDestroy() {
    this.subs.unsubscribe()
  }
  
}
