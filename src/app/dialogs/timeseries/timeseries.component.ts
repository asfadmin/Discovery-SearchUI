import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import * as models from '@models';

@Component({
  selector: 'app-timeseries',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatTableModule],
  templateUrl: './timeseries.component.html',
  styleUrl: './timeseries.component.scss'
})
export class TimeseriesComponent {
  public json_data: string = ''
  public dataSource = [];
  public displayedColumns: string[] = ['position', 'unwrapped_phase' ,'interferometric_correlation' ,'temporal_coherence']
  constructor(@Inject(MAT_DIALOG_DATA) public data: models.TimeSeriesResult,
  private dialogRef: MatDialogRef<TimeseriesComponent>,) {
    this.json_data = JSON.stringify(data, null, " ")
    this.dataSource = this.dataSource.concat(data.time_series.map((p, idx) => ({position: idx, ...p})))
    this.dataSource = this.dataSource.concat(({position: 'average', ...data.averages}))
    // this.dataSource = this.dataSource
  }


  public onClose(): void {
    this.dialogRef.close();
  }
}
