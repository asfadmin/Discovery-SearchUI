import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { TimeseriesChartConfigComponent } from '@components/timeseries-chart/timeseries-chart-config';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';
import { getSearchType } from '@store/search';
import { SearchType } from '@models';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-chart-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TimeseriesChartConfigComponent,
    MatMenuModule
],
  templateUrl: './chart-modal.component.html',
  styleUrl: './chart-modal.component.scss'
})

export class ChartModalComponent implements OnInit, OnDestroy {
  private subs = new SubSink()
  public searchType: SearchType;
  public SearchTypes = SearchType;

  constructor(public dialog: MatDialog,
    private $store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {
    this.subs.add(this.$store.select(getSearchType).subscribe(
      searchtype => this.searchType = searchtype
    ))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

}
