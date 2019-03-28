import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';

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
export class SpreadsheetComponent implements OnInit {
  public isShown = true;

  public allColumns: string[] = [
    'select', 'name', 'date', 'productType', 'beamMode',
    'polarization', 'path', 'frame', 'absoluteOrbit', 'bytes'
  ];
  public filterStr = '';

  public isColumnDisplayed: boolean[] = this.allColumns.map(_ => true);
  public displayedColumns = this.allColumns;

  public dataSource: MatTableDataSource<models.Sentinel1Product>;
  public selection = new SelectionModel<models.Sentinel1Product>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialogRef: MatDialogRef<SpreadsheetComponent>,
    private store$: Store<AppState>) {
  }

  public ngOnInit(): void {
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

  public onCloseDialog() {
    this.dialogRef.close();
  }

  public onRowHover(row) {
    /* Triggered when table row is hovered */
  }

  private keepCurrentFilter = dataSource => {
    const oldFilter = this.dataSource && this.dataSource.filter;

    if (oldFilter) {
      dataSource.filter = this.dataSource.filter;
    }

    return dataSource;
  }

  private addCustomProductDataAccessors = dataSource => {
    dataSource.sortingDataAccessor = (product, property) => {
      return product[property] || product.metadata[property];
    };

    dataSource.filterPredicate = (product, filter) => {
      const productWithOnlyTableFields = this.filterObject(
        this.allColumns,
        {...product, ...product.metadata}
      );

      return Object.values(productWithOnlyTableFields)
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
    const colIndex = this.allColumns.indexOf(columnToRemove);
    this.isColumnDisplayed[colIndex] = false;

    this.displayedColumns = this.allColumns
      .filter(
        (_, index) => this.isColumnDisplayed[index]
      );
  }

  public onColumnsReset(): void {
    this.displayedColumns = this.allColumns;
    this.isColumnDisplayed = this.displayedColumns.map(_ => true);
    this.applyFilter('');
  }


  public onHideSpreadsheet(): void {
    this.isShown = false;
  }

  applyFilter(filterStr: string) {
    this.filterStr = filterStr;
    this.dataSource.filter = this.filterStr.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
