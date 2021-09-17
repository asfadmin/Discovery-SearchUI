import { HttpClient,
  // HttpErrorResponse
 } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LonLat, SarviewsEvent, SarviewsProcessedEvent, SarviewsProduct } from '@models';
import {
  // forkJoin,
   Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { Feature } from 'geojson';
import { Range } from '@models';
import { WktService } from '@services';
import { MapService } from './map/map.service';
import { Coordinate } from 'ol/coordinate';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Polygon from 'ol/geom/Polygon';

@Injectable({
  providedIn: 'root'
})
export class SarviewsEventsService {

  private eventsUrl = `https://gm3385dq6j.execute-api.us-west-2.amazonaws.com/events`;

  constructor(private http: HttpClient,
    private wktService: WktService,
    private mapService: MapService,
              ) { }

  public getSarviewsEvents$(): Observable<SarviewsEvent[]> {
    return this.http.get<SarviewsEvent[]>(this.eventsUrl).pipe(
      map(events => events.filter(
        event => event.event_type.toLowerCase() !== 'flood'
      )),
      map(events => events.map(
        event => {
          return {
            ...event,
            processing_timeframe: this.getDates(event),
            point: this.getEventPoint(event.wkt),
          };
        }
    )));
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
    return this.http.get<SarviewsProcessedEvent>(this.eventsUrl + "/" + usgs_id).pipe(
      catchError(error => of(error)),
      map((event: SarviewsProcessedEvent) => {
        return {
          ...event,
          processing_timeframe: this.getDates(event)
        };
      })
      );
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
  public getSarviewsEventPinnedUrl(sarviews_url: string, products: SarviewsProduct[]) {
    const baseUrl = this.getSarviewsEventUrl(sarviews_url);
    const pinnedIds = products.map(prod => prod.product_id).reduce((prev, curr) => {
      return prev + curr + ','
    }, '?pinned=');
    return baseUrl + pinnedIds;
  }

  public getSarviewsEventUrl(sarviews_id: string) {
    return `https://sarviews-hazards.alaska.edu/Event/${sarviews_id}`;
  }

  public getUSGSEventUrl(usgs_id: string) {
    return `https://earthquake.usgs.gov/earthquakes/eventpage/${usgs_id}#executive`;
  }

  public getSmithsonianURL(smithsonian_id: string) {
    return `http://volcano.si.edu/volcano.cfm?vn=${smithsonian_id}`;
  }

  private getDates(event: SarviewsEvent | SarviewsProcessedEvent): Range<Date> {
    let eventDates = event.processing_timeframe;
    if(!!eventDates.start) {
      eventDates.start = new Date(eventDates.start);
    }
    if(!!eventDates.end) {
      eventDates.end = new Date(eventDates.end);
    }

    return eventDates;
  }

  private getEventPoint(wkt: string): LonLat {
    const isMultiPolygon = wkt.includes('MULTIPOLYGON');
    const feature = this.wktService.wktToFeature(wkt, this.mapService.epsg());

    const geom = feature.getGeometry();

    let polygonCoordinates: Coordinate[];
    if(isMultiPolygon) {
      polygonCoordinates = (geom as MultiPolygon).getPolygon(0).getCoordinates()[0];
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
    }

      const centerLat = (polygonCoordinates[0][0] + polygonCoordinates[1][0] + polygonCoordinates[2][0] + polygonCoordinates[3][0]) / 4.0;
      const centerLon = (polygonCoordinates[0][1] + polygonCoordinates[1][1] + polygonCoordinates[2][1] + polygonCoordinates[3][1]) / 4.0;

      return{lon: centerLon, lat: centerLat};
  }
}
