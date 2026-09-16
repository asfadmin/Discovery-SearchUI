import { Component, Output, EventEmitter, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { TimeseriesChartConfigComponent } from '@components/timeseries-chart/timeseries-chart-config';
@Component({
  selector: 'app-chart-modal',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TimeseriesChartConfigComponent,
    MatMenuModule,
    MatButtonToggleModule,
    TranslateModule,
  ],
  templateUrl: './chart-modal.component.html',
  styleUrl: './chart-modal.component.scss',
})
export class ChartModalComponent {
  dialog = inject(MatDialog);

  @Output() public resetReferenceEvent = new EventEmitter();

  public onResetReference() {
    this.resetReferenceEvent.emit();
  }
}
