import {Component, OnInit, ViewChild} from '@angular/core';

import { Store } from '@ngrx/store';

import { of, Observable } from 'rxjs';

import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { AppState } from '@store';
import * as granuleStore from '@store/granules';
import * as models from '@models';

@Component({
  selector: 'app-spreadsheet',
  templateUrl: './spreadsheet.component.html',
  styleUrls: ['./spreadsheet.component.css']
})
export class SpreadsheetComponent implements OnInit {
  displayedColumns: string[] = [
    'select', 'name', 'date', 'productType', 'beamMode',
    'polarization', 'path', 'frame', 'absolute orbit', 'bytes'
  ];

  dataSource: MatTableDataSource<models.Sentinel1Product>;
  selection = new SelectionModel<models.Sentinel1Product>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store$: Store<AppState>) {
    this.store$.select(granuleStore.getGranules).subscribe(
      granules => {
        let oldFilter: string;

        if (this.dataSource) {
         oldFilter = this.dataSource.filter;
        }

        this.dataSource = new MatTableDataSource(granules);

        if (!!oldFilter) {
          this.dataSource.filter = oldFilter;
        }

        this.dataSource.sortingDataAccessor = (product, property) => {
          return product[property] || product.metadata[property];
        };

        this.dataSource.filterPredicate = (product, filter) => {
          const flatProduct = {...product, ...product.metadata};

          return Object.values(flatProduct)
            .join('')
            .toLowerCase()
            .includes(filter);
        };

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngOnInit() {
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
