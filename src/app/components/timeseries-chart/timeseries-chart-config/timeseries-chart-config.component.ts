import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { SubSink } from 'subsink';
import * as chartsStore from '@store/charts'

@Component({
  selector: 'app-timeseries-chart-config',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './timeseries-chart-config.component.html',
  styleUrl: './timeseries-chart-config.component.scss'
})

// private DEFAULT_CHART: TimeseriesChartConfigDialogData = {showLines: {default: true, Checkbox}}

export class TimeseriesChartConfigComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  public showLines: boolean = true

  constructor(private store$: Store<AppState>) {}

    public onToggleLines(event: MatCheckboxChange) {
      console.log(event)
      if(event.checked) {
        this.store$.dispatch(chartsStore.showGraphLines())
      } else {
        this.store$.dispatch(chartsStore.hideGraphLines())
      }

    }

    ngOnInit(): void {
      this.subs.add(this.store$.select(chartsStore.getShowLines).subscribe(showLines => this.showLines = showLines))
    }

    ngOnDestroy(): void {
      this.subs.unsubscribe()
    }
}
