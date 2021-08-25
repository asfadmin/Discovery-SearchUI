import { HttpClient,
  // HttpErrorResponse
 } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SarviewsEvent, SarviewsProcessedEvent } from '@models';
import {
  // forkJoin,
   Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Feature } from 'geojson';


@Injectable({
  providedIn: 'root'
})
export class SarviewsEventsService {

  private eventsUrl = `https://gm3385dq6j.execute-api.us-west-2.amazonaws.com/events`;

  constructor(private http: HttpClient,
              ) { }

  public getSarviewsEvents$(): Observable<SarviewsEvent[]> {
    return this.http.get<SarviewsEvent[]>(this.eventsUrl);
  }

  // public getEventFeatures(usgs_event_ids: string[]): Observable<SarviewsEvent[]> {
  //   return forkJoin(
  //     usgs_event_ids.map(id => this.getEventFeature(id))).pipe(
  //     map(features => features.filter(
  //         feature => !(feature instanceof (HttpErrorResponse)))
  //     )
  //   );
  // }

  public getEventFeature(usgs_id: string): Observable<SarviewsProcessedEvent>  {
    return this.http.get<Feature>(this.eventsUrl + "/" + usgs_id).pipe(catchError(error => of(error)));
  }


  private sarviewsEvents$ = this.getSarviewsEvents$();

  public quakeIds$() {
    return this.sarviewsEvents$.pipe(
      map(events => events.filter(sarviewsEvent => sarviewsEvent.event_type === 'quake')),
      map(quakeEvents => quakeEvents.map(quake => quake.event_id)),
    );
  }

  public volcanoIds$() {
    return this.sarviewsEvents$.pipe(
    map(events => events.filter(sarviewsEvent => sarviewsEvent.event_type === 'volcano')),
    map(volcanoEvents => volcanoEvents.map(volcano => volcano.event_id)),
    );
  }

  public floodIds$() {
    return this.sarviewsEvents$.pipe(
    map(events => events.filter(sarviewsEvent => sarviewsEvent.event_type === 'flood')),
    map(volcanoEvents => volcanoEvents.map(volcano => volcano.event_id)),
    );
  }

  // public quakeEvents$() {
  //   return this.quakeIds$().pipe(
  //   switchMap(ids => this.getEventFeatures(ids)),
  //   map(events => <SarviewsQuakeEvent[]>events));
  // }

  // public volcanoEvents$() {
  //   return this.volcanoIds$().pipe(
  //   switchMap(ids => this.getEventFeatures(ids)),
  //   map(events => <SarviewsVolcanicEvent[]>events));
  // }

  // public floodEvents$() {
  //   return this.floodIds$().pipe(
  //   switchMap(ids => this.getEventFeatures(ids)),
  //   map(events => <SarviewsFloodEvent[]>events));
  // }

  // public getSarviewsEventCenter(coord: LonLat) {
  //   this.mapService.selectedSarviewEvent$.next()
  // }

  public getSarviewsEventUrl(sarviews_id: string) {
    return `https://sarviews-hazards.alaska.edu/Event/${sarviews_id}`;
  }
}
