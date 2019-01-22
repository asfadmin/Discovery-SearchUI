import {Component, OnInit, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';

import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { AppState } from '@store';
import * as granuleStore from '@store/granules';
import * as models from '@models';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.css']
})
export class SpreadsheetComponent {
  displayedColumns: string[] = [
    'select', 'name', 'date', 'productType', 'beamMode',
    'polarization', 'path', 'frame', 'absoluteOrbit', 'bytes'
  ];

  dataSource: MatTableDataSource<models.Sentinel1Product>;
  selection = new SelectionModel<models.Sentinel1Product>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store$: Store<AppState>) {
    this.store$.select(granuleStore.getGranules).pipe(
      map(granules => new MatTableDataSource(granules)),
      map(this.keepCurrentFilter),
      map(this.addCustomProductDataAccessors)
    ).subscribe(
      (dataSource: MatTableDataSource<models.Sentinel1Product>) => {
        this.dataSource = dataSource;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  private addCustomProductDataAccessors = dataSource => {

    dataSource.sortingDataAccessor = (product, property) => {
      return product[property] || product.metadata[property];
    };

    dataSource.filterPredicate = (product, filter) => {
      const flatProduct = {...product, ...product.metadata};

      const onlyTableFields = {};
      for (const key of this.displayedColumns) {
        if (flatProduct[key]) {
          onlyTableFields[key] = flatProduct[key];
        }
      }

      return Object.values(onlyTableFields)
        .join('')
        .toLowerCase()
        .indexOf(filter) !== -1;
    };

    return dataSource;
  }

  private keepCurrentFilter = dataSource => {
    const oldFilter = this.dataSource && this.dataSource.filter;

    if (oldFilter) {
      dataSource.filter = this.dataSource.filter;
    }

    return dataSource;
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

  public shortDate(date: Date): string {
    const [month, day, year] = [
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCFullYear()
    ];

    return `${year}-${month}-${day}`;
  }
}
