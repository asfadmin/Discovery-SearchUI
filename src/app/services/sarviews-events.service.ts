import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LonLat, SarviewsEvent, SarviewsProcessedEvent, SarviewsProduct } from '@models';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Range } from '@models';
import { WktService } from '@services';
import { MapService } from './map/map.service';
import { Coordinate } from 'ol/coordinate';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Polygon from 'ol/geom/Polygon';
import * as models from '@models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class SarviewsEventsService {

  private eventsUrl = `https://gm3385dq6j.execute-api.us-west-2.amazonaws.com/events`;
  private sarviewsEvents$ = this.getSarviewsEvents$();

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
            processing_timeframe: !!event.processing_timeframe ? this.getDates(event) : null,
            point: this.getEventPoint(event.wkt),
          } as SarviewsEvent;
        }
    )),
    map(events => events.sort((a, b) => {
      if (a.processing_timeframe.start > b.processing_timeframe.start) {
        return -1;
      } else if (a.processing_timeframe.start < b.processing_timeframe.start) {
        return 1;
      }
      return 0;
    })));
  }

  public getEventFeature(usgs_id: string): Observable<SarviewsProcessedEvent>  {
    return this.http.get<SarviewsProcessedEvent>(this.eventsUrl + '/' + usgs_id).pipe(
      catchError(error => of(error)),
      map((event: SarviewsProcessedEvent) => {
        return {
          ...event,
          processing_timeframe: !!event.processing_timeframe ? this.getDates(event) : null
        };
      })
      );
  }

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

  public getSarviewsEventPinnedUrl(sarviews_url: string, product_ids: string[]) {
    const baseUrl = this.getSarviewsEventUrl(sarviews_url);
    const pinnedIds = product_ids.reduce((prev, curr) => {
      return prev + curr + ',';
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
    const eventDates = event.processing_timeframe;

    if (!eventDates) {
      return event.processing_timeframe;
    }
    if (!!eventDates.start) {
      eventDates.start = new Date(eventDates.start);
    }
    if (!!eventDates.end) {
      eventDates.end = new Date(eventDates.end);
    }

    return eventDates;
  }

  private getEventPoint(wkt: string): LonLat {
    const isMultiPolygon = wkt.includes('MULTIPOLYGON');
    const feature = this.wktService.wktToFeature(wkt, this.mapService.epsg());

    const geom = feature.getGeometry();

    let polygonCoordinates: Coordinate[];
    if (isMultiPolygon) {
      polygonCoordinates = (geom as MultiPolygon).getPolygon(0).getCoordinates()[0];
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
    }

      const centerLat = (polygonCoordinates[0][0] + polygonCoordinates[1][0] + polygonCoordinates[2][0] + polygonCoordinates[3][0]) / 4.0;
      const centerLon = (polygonCoordinates[0][1] + polygonCoordinates[1][1] + polygonCoordinates[2][1] + polygonCoordinates[3][1]) / 4.0;

      return{lon: centerLon, lat: centerLat};
  }

  public getSourceCMRProducts(product: models.SarviewsProduct): models.CMRProduct[] {
    const toCMRProducts: models.CMRProduct[] = product.granules.map( granule =>
        this.toCMRProduct(product, granule)
    );

      return toCMRProducts;
  }

    public eventProductToCMRProduct(product: models.SarviewsProduct): models.CMRProduct {
      return this.toCMRProduct(product, product.granules[0]);
    }

    private toCMRProduct(product: SarviewsProduct, granule: models.SarviewProductGranule) {
      const jobTypes = Object.values(models.hyp3JobTypes);
      const jobType = jobTypes.find(t => t.id === product.job_type);

      const productTypeDisplay = `${jobType.name}, ${jobType.productTypes[0].productTypes[0]}`;

      return {
        name: granule.granule_name,
        productTypeDisplay,
        file: '',
        id: product.product_id,
        downloadUrl: product.files.product_url,
        bytes: product.files.product_size,
        browses: [product.files.browse_url],
        thumbnail: '',
        dataset: 'Sentinel-1',
        groupId: 'SARViews',
        isUnzippedFile: false,

        metadata: {
          date: moment(product.processing_date),
          stopDate: moment(product.processing_date),
          polygon: granule.wkt,
          productType: jobType.name

        } as models.CMRProductMetadata
      };
    }

    public hyp3able(product: models.SarviewsProduct): models.Hyp3ableProductByJobType {
      const hyp3Prod: models.Hyp3ableByProductType = {
        productType: product.job_type,
        products: [this.getSourceCMRProducts(product)]
      };
      const byProductType: models.Hyp3ableByProductType[] = [hyp3Prod];

      const output: models.Hyp3ableProductByJobType = {
        jobType: models.hyp3JobTypes[product.job_type],
        byProductType,
        total: 1
      } ;
      return output;
    }

    public toHyp3ableProducts(products: models.SarviewsProduct[]): {byJobType: models.Hyp3ableProductByJobType[]; total: number} {
      // let total = 0;
      // const productsTypes = models.hyp3JobTypes;

      // const types = {};
      const hyp3ProductsByType = {};
      products.forEach( product => {
        const productType = product.job_type;

        if (!hyp3ProductsByType[productType]) {
          hyp3ProductsByType[productType] = [];
        }

        hyp3ProductsByType[productType].push(this.getSourceCMRProducts(product));
      });

      const byProductType: models.Hyp3ableByProductType[] = [];
      Object.keys(hyp3ProductsByType).forEach(key =>
        byProductType.push({productType: key, products: hyp3ProductsByType[key]}));
      // byJobType
      // const byProductType: models.Hyp3ableByProductType[] = [hyp3Prod];

      const output: models.Hyp3ableProductByJobType[] = Object.keys(hyp3ProductsByType).map(key => ({
        jobType: models.hyp3JobTypes[key],
        byProductType: byProductType.filter(prod => prod.productType === key),
        total: byProductType.find(prod => prod.productType === key).products.length
      }));


      // const output: models.Hyp3ableProductByJobType = {
      //   jobType: models.hyp3JobTypes[product.job_type],
      //   byProductType,
      //   total: 1
      // } ;
      return {byJobType: output, total: output.reduce((prev, curr) => prev += curr.total, 0)};

    }
}
