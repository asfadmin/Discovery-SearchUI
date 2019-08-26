import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { MapService, WktService } from '@services';

@Component({
  selector: 'app-aoi-clear',
  templateUrl: './aoi-clear.component.html',
  styleUrls: ['./aoi-clear.component.css']
})
export class AoiClearComponent implements OnInit {
  public polygon: string;
  public savedPolygon: string | null = null;
  public anyPathFrameValues = false;

  constructor(
    private mapService: MapService,
    private wktService: WktService,
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.mapService.searchPolygon$.pipe(
      tap(polygon => {
        if (polygon) {
          this.savedPolygon = null;
        }
      })
    ).subscribe(
      polygon => this.polygon = polygon
    );

    this.store$.select(filtersStore.getPathFrameRanges).pipe(
      map(({frameRange, pathRange}) =>
        !!(frameRange.start || frameRange.end || pathRange.start || pathRange.end)
      )
    ).subscribe(
      anyPathFrameValues => this.anyPathFrameValues = anyPathFrameValues
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

}
