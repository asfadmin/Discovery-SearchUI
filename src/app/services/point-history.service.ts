import { Injectable, inject } from '@angular/core';
import { timeseriesChartItemState } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import {
  addTimeseriesState,
  removeTimeseriesState,
  resetTimeseriesStates,
  setTimeseriesStates,
} from '@store/charts';
import WKT from 'ol/format/WKT';

import { Geometry } from 'ol/geom';
import { Subject } from 'rxjs';
import * as models from '@models';

export interface PointHistoryState {
  uuidSeries: string;
  point: Geometry;
  wkt: string;
  drawMode: models.MapDrawModeType;
  seriesNumber: number;
  seriesName: string;
}

@Injectable({
  providedIn: 'root',
})
export class PointHistoryService {
  private store$ = inject<Store<AppState>>(Store);

  private history: PointHistoryState[] = [];
  public history$ = new Subject<PointHistoryState[]>();
  public passDraw = false;
  public selectedPoint = '';

  public getHistory(): PointHistoryState[] {
    return this.history;
  }

  public findPoint(wkt: string) {
    return this.history.find((value, _index) => {
      if (value.wkt === wkt)
        return {
          point: value.point,
          wkt: wkt,
        };
    });
  }

  public addPoint(
    point: Geometry,
    seriesNumber: number,
    seriesName: string,
    drawMode: models.MapDrawModeType,
    id?: string,
  ) {
    if (this.passDraw) {
      this.passDraw = false;
      return;
    }
    const uuidSeries = id ?? crypto.randomUUID();
    const format = new WKT();
    const wkt = format.writeGeometry(point);
    if (!this.history.find((x) => x.wkt == wkt)) {
      const sName =
        seriesName === '' || seriesName === null ? 'Series' : seriesName;
      this.history.push({
        uuidSeries,
        point,
        wkt,
        drawMode,
        seriesNumber,
        seriesName: sName,
      });
      this.store$.dispatch(
        addTimeseriesState({
          item: {
            uuidSeries: uuidSeries,
            geometry: point,
            checked: true,
            seriesNumber: seriesNumber,
            seriesName: sName,
            wkt: wkt,
            linearFit: false,
            drawMode: drawMode,
          },
        }),
      );
      this.history$.next(this.history);
      this.savePoints();
    }
  }

  public addPoints(states: timeseriesChartItemState[]) {
    if (states.length <= 0) {
      return;
    }
    for (const state of states) {
      const sName =
        state.seriesName === '' || state.seriesName === null
          ? 'Series'
          : state.seriesName;
      const point = state.geometry as Geometry;
      this.history = [
        ...this.history,
        {
          uuidSeries: state.uuidSeries,
          point: point,
          wkt: state.wkt,
          drawMode: state.drawMode,
          seriesNumber: state.seriesNumber,
          seriesName: sName,
        },
      ];
      //   this.store$.dispatch(addTimeseriesState({item: state}))
    }
    this.history$.next(this.history);
    this.store$.dispatch(setTimeseriesStates({ items: states }));
    this.savePoints();
  }

  public clear() {
    this.history = [];
    this.history$.next(this.history);
    this.store$.dispatch(resetTimeseriesStates());
    this.selectedPoint = '';
    this.savePoints();
  }

  public removePoint(uuid) {
    const index = this.history.findIndex((x) => {
      return x.uuidSeries === uuid;
    });
    uuid = this.history[index].uuidSeries;

    this.history.splice(index, 1);
    this.history$.next(this.history);
    this.store$.dispatch(removeTimeseriesState({ uuid }));
    this.savePoints();
  }

  public clearPoints() {
    this.history = [];
    this.history$.next(this.history);
  }

  private savePoints() {
    const converted = this.history.map((value) => {
      return {
        uuidSeries: value.uuidSeries,
        point: value.point,
        wkt: value.wkt,
        drawMode: value.drawMode,
        seriesNumber: value.seriesNumber,
        seriesName: value.seriesName,
      };
    });
    localStorage.setItem('timeseries-points', JSON.stringify(converted));
  }
}
