import { Injectable } from '@angular/core';
import { timeseriesChartItemState } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { addTimeseriesState, removeTimeseriesState, resetTimeseriesStates } from '@store/charts';
import WKT from 'ol/format/WKT';

import { Geometry } from 'ol/geom';
import { Subject } from 'rxjs';
import * as models from '@models';

export interface PointHistoryState {
  point: Geometry;
  wkt: string;
  drawMode: models.MapDrawModeType;
}


@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private history : PointHistoryState[] = [];
  public history$ = new Subject<PointHistoryState[]>();
  public passDraw: boolean = false;
  public selectedPoint: number = 0;

  constructor(
    private store$: Store<AppState>,
  ) { }

  public getHistory(): {point: Geometry, wkt: string}[] {
    return this.history;
  }

  public findPoint(wkt: string){
    return this.history.find( (value, _index) => {
      if (value.wkt === wkt)
        return {
          point: value.point,
          wkt: wkt
        };
    })
  }

  public addPoint(point: Geometry, seriesNumber: number, drawMode: models.MapDrawModeType) {
    if(this.passDraw) {
      this.passDraw = false
      return
    }
    const format = new WKT()
    const wkt = format.writeGeometry(point)
    if (!!!this.history.find(x => x.wkt == wkt)) {
      this.history.push({point, wkt, drawMode});
      this.store$.dispatch(addTimeseriesState({item: {geometry: point, checked: true, seriesNumber, wkt: wkt, name: `Series ${seriesNumber}`, linearFit: false, drawMode: drawMode}}))
      this.history$.next(this.history);
      this.savePoints();
    }
  }

  public addPoints(states: timeseriesChartItemState[]) {
    if(states.length <= 0) {
      return
    }
    console.log('addPoints states:', states);
    for(let state of states) {
      const point = state.geometry as Geometry;
      this.history = [...this.history,{point, wkt: state.wkt, drawMode: state.drawMode} ]
      this.store$.dispatch(addTimeseriesState({item: state}))
    }
    this.history$.next(this.history);
    this.savePoints();
  }

  public clear() {
    this.history = [];
    this.history$.next(this.history);
    this.store$.dispatch(resetTimeseriesStates())
    this.selectedPoint = -1;
    this.savePoints();
  }
  public removePoint(index) {
    // const format = new WKT()
    const wkt = this.history[index].wkt
    this.history.splice(index,1);
    this.history$.next(this.history)
    this.store$.dispatch(removeTimeseriesState({wkt}))
    this.savePoints();

  }

  public clearPoints() {
    this.history = [];
    this.history$.next(this.history);
  }

  private savePoints() {
    console.log('saving points this.history:', this.history);
    let converted = this.history.map((value) => {
      console.log('saving points this value:', value);
      return { point: value.point, wkt: value.wkt, drawMode: value.drawMode }
    })
    console.log('converted:', converted);
    localStorage.setItem('timeseries-points', JSON.stringify(converted))
  }

}
