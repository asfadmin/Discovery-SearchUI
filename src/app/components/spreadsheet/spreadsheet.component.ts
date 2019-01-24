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
  styleUrls: ['./spreadsheet.component.scss']
})
export class SpreadsheetComponent {
  allColumns: string[] = [
    'select', 'name', 'date', 'productType', 'beamMode',
    'polarization', 'path', 'frame', 'absoluteOrbit', 'bytes'
  ];

  isColumnDisplayed: boolean[] = this.allColumns.map(_ => true);
  displayedColumns = this.allColumns;

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

  public onRowHover(row) {
    /* Triggered when table row is hovered */
  }

  private addCustomProductDataAccessors = dataSource => {

    dataSource.sortingDataAccessor = (product, property) => {
      return product[property] || product.metadata[property];
    };

    dataSource.filterPredicate = (product, filter) => {
      const onlyTableFieldsProduct = this.filterObject(
        this.allColumns,
        {...product, ...product.metadata}
      );

      return Object.values(onlyTableFieldsProduct)
        .join('')
        .toLowerCase()
        .indexOf(filter) !== -1;
    };

    return dataSource;
  }

  private filterObject(allowedKeys: string[], product: Object): Object {
    return Object.keys(product)
      .filter(key => allowedKeys.includes(key))
      .reduce((prod, key) => {
        prod[key] = product[key];
        return prod;
      }, {});
  }

  public onRemoveColumn(columnToRemove: string): void {
    console.log(columnToRemove);

    const colIndex = this.allColumns.indexOf(columnToRemove);
    this.isColumnDisplayed[colIndex] = false;

    this.displayedColumns = this.allColumns
      .filter((_, index) => this.isColumnDisplayed[index]);
  }

  public onColumnsReset(): void {
    this.displayedColumns = this.allColumns;
    this.isColumnDisplayed = this.displayedColumns.map(_ => true);
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
