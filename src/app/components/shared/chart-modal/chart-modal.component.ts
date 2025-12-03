import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TimeseriesChartConfigComponent } from '@components/timeseries-chart/timeseries-chart-config';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { SubSink } from 'subsink';
import { getSearchType } from '@store/search';
import { SearchType } from '@models';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@Component({
  selector: 'app-chart-modal',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TimeseriesChartConfigComponent,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  templateUrl: './chart-modal.component.html',
  styleUrl: './chart-modal.component.scss',
})
export class ChartModalComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);
  private $store = inject<Store<AppState>>(Store);

  private subs = new SubSink();
  public searchType: SearchType;
  public SearchTypes = SearchType;
  @Output() public resetReferenceEvent = new EventEmitter();

  ngOnInit(): void {
    this.subs.add(
      this.$store
        .select(getSearchType)
        .subscribe((searchtype) => (this.searchType = searchtype)),
    );
  }
  public onResetReference() {
    this.resetReferenceEvent.emit();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
