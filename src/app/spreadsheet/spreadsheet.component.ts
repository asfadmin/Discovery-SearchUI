import {Component, OnInit, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';

import { of, Observable } from 'rxjs';

import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { AppState } from '../store';
import * as granuleStore from '../store/granules';
import * as models from '../models';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.css']
})
export class SpreadsheetComponent implements OnInit {
  displayedColumns: string[] = ['select', 'id', 'name', 'progress', 'color'];
  dataSource: MatTableDataSource<models.Sentinel1Product>;
  selection = new SelectionModel<models.Sentinel1Product>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store$: Store<AppState>) {
    this.store$.select(granuleStore.getGranules).subscribe(
      granules => this.dataSource = new MatTableDataSource(granules)
    );
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
