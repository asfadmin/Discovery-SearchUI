import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { MapService, WktService } from '@services';
import { getSearchType } from '@store/search';
import { SearchType } from '@models';

@Component({
    selector: 'app-aoi-clear',
    templateUrl: './aoi-clear.component.html',
    styleUrls: ['./aoi-clear.component.scss'],
    standalone: false
})
export class AoiClearComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private wktService = inject(WktService);
  private store$ = inject<Store<AppState>>(Store);

  public searchTypes = SearchType;
  public searchType$ = this.store$.select(getSearchType);

  public polygon: string;
  public savedPolygon: string | null = null;
  public anyPathFrameValues = false;

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.mapService.searchPolygon$
        .pipe(
          tap((polygon) => {
            if (polygon) {
              this.savedPolygon = null;
            }
          }),
        )
        .subscribe((polygon) => (this.polygon = polygon)),
    );

    this.subs.add(
      this.store$
        .select(filtersStore.getPathFrameRanges)
        .pipe(
          map(
            ({ frameRange, pathRange }) =>
              !!(
                frameRange.start ||
                frameRange.end ||
                pathRange.start ||
                pathRange.end
              ),
          ),
        )
        .subscribe(
          (anyPathFrameValues) =>
            (this.anyPathFrameValues = anyPathFrameValues),
        ),
    );
  }

  public onClearSearchArea(): void {
    this.savedPolygon = this.polygon;
    this.mapService.clearDrawLayer();
  }

  public undoPolygonClear(): void {
    const features = this.wktService.wktToFeature(
      this.savedPolygon,
      this.mapService.epsg(),
    );

    this.mapService.setDrawFeature(features);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
