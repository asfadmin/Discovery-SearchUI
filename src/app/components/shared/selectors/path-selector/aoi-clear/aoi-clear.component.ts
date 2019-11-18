import { Component, OnInit, OnDestroy } from '@angular/core';

import { map, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { MapService, WktService } from '@services';

@Component({
  selector: 'app-aoi-clear',
  templateUrl: './aoi-clear.component.html',
  styleUrls: ['./aoi-clear.component.css']
})
export class AoiClearComponent implements OnInit, OnDestroy {
  public polygon: string;
  public savedPolygon: string | null = null;
  public anyPathFrameValues = false;

  private subs = new SubSink();

  constructor(
    private mapService: MapService,
    private wktService: WktService,
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.subs.add(
      this.mapService.searchPolygon$.pipe(
        tap(polygon => {
          if (polygon) {
            this.savedPolygon = null;
          }
        })
      ).subscribe(
        polygon => this.polygon = polygon
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getPathFrameRanges).pipe(
        map(({frameRange, pathRange}) =>
          !!(frameRange.start || frameRange.end || pathRange.start || pathRange.end)
        )
      ).subscribe(
        anyPathFrameValues => this.anyPathFrameValues = anyPathFrameValues
      )
    );
  }

  public onClearSearchArea(): void {
    this.savedPolygon = this.polygon;
    this.mapService.clearDrawLayer();
  }

  public undoPolygonClear(): void {
    const features = this.wktService.wktToFeature(
      this.savedPolygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
