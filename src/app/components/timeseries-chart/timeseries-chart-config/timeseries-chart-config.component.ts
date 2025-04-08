import { Component, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as chartsStore from '@store/charts'
import { SharedModule } from "@shared";

@Component({
    selector: 'app-timeseries-chart-config',
    imports: [MatIconModule, MatButtonModule, MatCheckboxModule, SharedModule,],
    templateUrl: './timeseries-chart-config.component.html',
    styleUrl: './timeseries-chart-config.component.scss'
})



export class TimeseriesChartConfigComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  public showLines: boolean = true
  public showLinearFit = false;
  @Output() public resetReferenceEvent = new EventEmitter();
  constructor(private store$: Store<AppState>) { }


  public onToggleLines(event: MatCheckboxChange) {
    if (event.checked) {
      this.store$.dispatch(chartsStore.showGraphLines())
    } else {
      this.store$.dispatch(chartsStore.hideGraphLines())
    }
  }
  public onToggleLinearFit(event: MatCheckboxChange) {
    if(event.checked) {
      this.store$.dispatch(chartsStore.showLinearFit());
    } else {
      this.store$.dispatch(chartsStore.hideLinearFit());
    }
  }

  ngOnInit(): void {
    this.subs.add(this.store$.select(chartsStore.getShowLines).subscribe(
        showLines => this.showLines = showLines
      )
    );
    this.subs.add(this.store$.select(chartsStore.getShowLinearFit).subscribe(
      showLinearFit => this.showLinearFit = showLinearFit
    ))
  }

  public resetReference() {
    this.resetReferenceEvent.emit();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
