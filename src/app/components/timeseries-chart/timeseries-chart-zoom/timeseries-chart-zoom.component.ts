import { Component } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-timeseries-chart-zoom',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatTooltip,
    TranslateModule
  ],
  templateUrl: './timeseries-chart-zoom.component.html',
  styleUrl: './timeseries-chart-zoom.component.scss'
})
export class TimeseriesChartZoomComponent {

  public zoomInChart$ = new Subject<void>();
  public zoomOutChart$ =  new Subject<void>();
  public zoomToFitChart$ =  new Subject<void>();

  public zoomIn(): void {
    this.zoomInChart$.next();
  }

  public zoomOut(): void {
    this.zoomOutChart$.next();
  }

  public zoomToFit(): void {
    this.zoomToFitChart$.next();
  }


}
