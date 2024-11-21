import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { addTimeseriesState, removeTimeseriesState } from '@store/charts';
import WKT from 'ol/format/WKT';

import { Point } from 'ol/geom';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private history : {point: Point, wkt: string}[] = [];
  public history$ = new Subject<{point: Point, wkt: string}[]>();
  public passDraw: boolean = false;
  public selectedPoint: number = 0;

  constructor(
    private store$: Store<AppState>,
  ) {


  }

  public getHistory(): {point: Point, wkt: string}[] {
    return this.history;
  }


  public addPoint(point: Point, seriesNumber: number) {
    if(this.passDraw) {
      this.passDraw = false
      return
    }
    const format = new WKT()
    const wkt = format.writeGeometry(point)
    this.history.push({point, wkt});
    this.store$.dispatch(addTimeseriesState({item: {geoemetry: point, checked: true, seriesNumber, wkt: wkt, name: `Series ${seriesNumber}`, linearFit: false}}))
    this.history$.next(this.history);
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
