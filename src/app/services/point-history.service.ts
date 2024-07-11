import { Injectable } from '@angular/core';

import { Point } from 'ol/geom';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PointHistoryService {
  private history : Point[] = [new Point([50,50])];
  public history$ = new Subject<Point[]>();

  constructor(
  ) {
  }

  public getHistory(): Point[] {
    return this.history;
  }


  public addPoint(point: Point) {
    this.history.push(point);
    this.history$.next(this.history);
  }



}
