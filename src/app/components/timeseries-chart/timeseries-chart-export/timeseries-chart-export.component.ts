import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import moment from 'moment';

import {
  NetcdfService
} from '@services';
@Component({
  selector: 'app-timeseries-chart-export',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './timeseries-chart-export.component.html',
  styleUrl: './timeseries-chart-export.component.scss'
})
export class TimeseriesChartExportComponent {
  private netcdfService = inject(NetcdfService);


  @Input() timeSeriesData: Record<string, object[]> = {}


  private currentDate(): string {
    return moment().format('YYYY-MM-DD_hh-mm-ss');
  }

  public onExportCSV() {

    const output = this.netcdfService.toCSV(this.timeSeriesData)
    const blob = new Blob([output], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    FileSaver.saveAs(blob,
      `asf-opera-displacement-${this.currentDate()}.csv`
    )
  }
}
