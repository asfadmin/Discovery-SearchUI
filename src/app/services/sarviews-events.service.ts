import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SarviewsEvent } from '@models';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Feature } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class SarviewsEventsService {

  private eventsUrl = `https://gm3385dq6j.execute-api.us-west-2.amazonaws.com/events`;

  constructor(private http: HttpClient) { }

  public getSarviewsEvents(): Observable<SarviewsEvent[]> {
    return this.http.get<SarviewsEvent[]>(this.eventsUrl);
  }

  public getEventFeatures(usgs_event_ids: string[]): Observable<SarviewsEvent[]> {
    return forkJoin(
      usgs_event_ids.map(id => this.getEventFeature(id))).pipe(
      map(features => features.filter(
          feature => !(feature instanceof (HttpErrorResponse)))
      )
    );
  }

  public getEventFeature(usgs_id: string): Observable<SarviewsEvent>  {
    return this.http.get<Feature>(this.eventsUrl + "/" + usgs_id).pipe(catchError(error => of(error)));
  }
}
