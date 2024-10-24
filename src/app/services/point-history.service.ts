import { Injectable } from '@angular/core';
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
    this.history.push(point);
    this.history$.next(this.history);
    this.savePoints();
  }
  public removePoint(index) {
    this.history.splice(index,1);
    this.history$.next(this.history)
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
