import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar, MatBottomSheet } from '@angular/material';

import { Store } from '@ngrx/store';

import {
  filter, map, switchMap, tap, catchError
} from 'rxjs/operators';

import { SpreadsheetComponent } from '@components/spreadsheet';

import { AppState } from '@store';
import * as granulesStore from '@store/granules';
import * as mapStore from '@store/map';
import * as filterStore from '@store/filters';
import * as searchStore from '@store/search';

import * as services from '@services';
import * as models from './models';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public shouldOmitSearchPolygon$ = this.store$.select(filterStore.getShouldOmitSearchPolygon);

  public interactionTypes = models.MapInteractionModeType;

  constructor(
    private store$: Store<AppState>,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private mapService: services.MapService,
    private asfApiService: services.AsfApiService,
    private urlStateService: services.UrlStateService,
    private wktService: services.WktService,
  ) {}

  public ngOnInit(): void {
    this.validateSearchPolygons();
  }

  public onLoadUrlState(): void {
    this.urlStateService.load();
  }

  public onOpenSpreadsheet(): void {
    this.bottomSheet.open(SpreadsheetComponent, {
      panelClass: 'spreadsheet-width'
    });
  }

  public onNewSearch(): void {
    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public onClearSearch(): void {
    this.store$.dispatch(new granulesStore.ClearGranules());
    this.store$.dispatch(new filterStore.ClearFilters());
    this.mapService.clearDrawLayer();
  }

  private validateSearchPolygons(): void {
    this.mapService.searchPolygon$.pipe(
      filter(p => !!p),
      switchMap(polygon => this.asfApiService.validate(polygon)),
      map(resp => {
        if (resp.error) {
          const { report, type } = resp.error;

          this.mapService.setDrawStyle(models.DrawPolygonStyle.INVALID);
          this.snackBar.open(
            report, 'INVALID POLYGON',
            { duration: 4000, }
          );

          return;
        } else {
          this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID);

          const repairs = resp.repairs
            .filter(repair =>
              repair.type !== models.PolygonRepairTypes.ROUND
            );

          if (repairs.length === 0) {
            return resp.wkt;
          }

          const { report, type }  = resp.repairs.pop();

          this.snackBar.open(
            report, type,
            { duration: 4000, }
          );

          const features = this.wktService.wktToFeature(
            resp.wkt,
            this.mapService.epsg()
          );

          this.mapService.setDrawFeature(features);
        }
      }),
      catchError((val, source) => source)
    ).subscribe(_ => _);
  }
}
