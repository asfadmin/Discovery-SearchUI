import {Component, EventEmitter, Output} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';

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
  // @Output('zoomIn$') zoomIn$: Subject<void> = new Subject<void>();
  // @Output('zoomInChart$') zoomInChart$: EventEmitter<any> = new EventEmitter();
  @Output() zoomInEvent = new EventEmitter<void>();
  @Output() zoomOutEvent = new EventEmitter<void>();
  @Output() zoomToFitEvent = new EventEmitter<void>();

  // public zoomInChart$ = new Subject<void>();
  // public zoomOutChart$ =  new Subject<void>();
  // public zoomToFitChart$ =  new Subject<void>();

  public zoomIn(): void {
    console.log('zoomIn');
    this.zoomInEvent.emit();
  }

  public zoomOut(): void {
    this.zoomOutEvent.emit();
  }

  public zoomToFit(): void {
    this.zoomToFitEvent.emit();
  }


}
