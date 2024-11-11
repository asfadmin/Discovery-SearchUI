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
  private history : Point[] = [];
  public history$ = new Subject<Point[]>();
  public passDraw: boolean = false;
  public selectedPoint: number = 0;
  
  constructor(
    private store$: Store<AppState>
  ) {


  }

  public getHistory(): Point[] {
    return this.history;
  }


  public addPoint(point: Point) {
    if(this.passDraw) {
      this.passDraw = false
      return
    }
    const format = new WKT()
    const wkt = format.writeGeometry(point)
    this.history.push(point);
    this.store$.dispatch(addTimeseriesState({item: {geoemetry: point, checked: true, wkt: wkt, color: '#FFFFFF', name: `Series ${this.history.length}`}}))
    this.history$.next(this.history);
    this.savePoints();
  }
  public removePoint(index) {
    const format = new WKT()
    const wkt = format.writeGeometry(this.history[index])
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
    let format = new WKT();
    let converted = this.history.map((value) => {
      return format.writeGeometry(value)
    })
    localStorage.setItem('timeseries-points', converted.join(';'))
  }



}
