import { Injectable } from '@angular/core';

import { Point } from 'ol/geom';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private history : Point[] = [];
  public history$ = new Subject<Point[]>();
  public passDraw: boolean = false;
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
  }



}
