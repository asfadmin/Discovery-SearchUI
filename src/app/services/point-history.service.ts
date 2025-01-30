import { Injectable } from '@angular/core';
import { timeseriesChartItemState } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { addTimeseriesState, removeTimeseriesState, resetTimeseriesStates } from '@store/charts';
import WKT from 'ol/format/WKT';

import { Geometry } from 'ol/geom';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private history : {point: Geometry, wkt: string}[] = [];
  public history$ = new Subject<{point: Geometry, wkt: string}[]>();
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

  public addPoint(point: Geometry, seriesNumber: number) {
    if(this.passDraw) {
      this.passDraw = false
      return
    }
    const format = new WKT()
    const wkt = format.writeGeometry(point)
    if (!!!this.history.find(x => x.wkt == wkt)) {
      this.history.push({point, wkt});
      this.store$.dispatch(addTimeseriesState({item: {geometry: point, checked: true, seriesNumber, wkt: wkt, name: `Series ${seriesNumber}`, linearFit: false}}))
      this.history$.next(this.history);
      this.savePoints();
    }
  }

  public addPoints(states: timeseriesChartItemState[]) {
    if(states.length <= 0) {
      return
    }
    for(let state of states) {
      const point = state.geometry as Geometry;
      this.history = [...this.history,{point, wkt: state.wkt} ]
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
    let converted = this.history.map((value) => {
      return value.wkt
    })
    localStorage.setItem('timeseries-points', converted.join(';'))
  }



}
