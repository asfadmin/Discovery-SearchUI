import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventProductSortDirection, EventProductSortType, LonLat, SarviewsEvent, SarviewsProcessedEvent, SarviewsProduct } from '@models';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { Range } from '@models';
import { WktService } from '@services';
import { MapService } from './map/map.service';
import { Coordinate } from 'ol/coordinate';
import MultiPolygon from 'ol/geom/MultiPolygon';
import Polygon from 'ol/geom/Polygon';
import * as models from '@models';
import * as moment from 'moment';
import { getSarviewsEvents, getSelectedSarviewsEventProducts } from '@store/scenes';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

@Injectable({
  providedIn: 'root'
})
export class SarviewsEventsService {

  private eventsUrl = `https://gm3385dq6j.execute-api.us-west-2.amazonaws.com/events`;
  private sarviewsEvents$ = this.getSarviewsEvents$();

  constructor(private http: HttpClient,
    private wktService: WktService,
    private mapService: MapService,
    private store$: Store<AppState>
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
      polygonCoordinates = this.wktService.fixAntimeridianCoordinates(polygonCoordinates);

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

  public filteredSarviewsEvents$(): Observable<SarviewsEvent[]> {
    return (
      this.filterByEventMagnitude$(
      this.filterSarviewsEventsByName$(
        this.filterByEventType$(
        this.filterByEventDate$(
          this.filterByEventActivity$(
                this.store$.select(getSarviewsEvents)
              )
            )
          )
        )
      )
    );
  }

  public filteredEventProducts$(): Observable<SarviewsProduct[]> {
    return (
      this.ProductSortOrder$(
       this.filterByProductPathFrame$(
         this.filterByProductDate$(
           this.filterByProductType$(
             this.store$.select(getSelectedSarviewsEventProducts)
             )
           )
         )
       )
    );
  }

  private filterByProductDate$(products$: Observable<SarviewsProduct[]>) {
    return combineLatest(
      [
        products$,
        this.store$.select(filtersStore.getSarviewsEventProductsDateRange)
      ]
    ).pipe(
      map(([products, dateRange]) => products.filter(prod => {
        const date = new Date(prod.granules[0].acquisition_date);
        if (!!dateRange.start) {
          if (date < dateRange.start) {
            return false;
          }
        }

        if (!!dateRange.end) {
          if (date > dateRange.end) {
            return false;
          }
        }

        return true;
      }))
    );
  }

  private filterByProductPathFrame$(products$: Observable<SarviewsProduct[]>) {
    return combineLatest(
      [
        products$,
        this.store$.select(filtersStore.getPathFrameRanges)
      ]
    ).pipe(
      map(([products, pathAndFrame]) => {
        return products.filter(product => {

          if (pathAndFrame?.pathRange?.start !== null) {
            if (product.granules[0].path < pathAndFrame.pathRange.start) {
              return false;
            }
          }
          if (pathAndFrame?.pathRange?.end !== null) {
            if (product.granules[0].path > pathAndFrame.pathRange.end) {
              return false;
            }
          }

          if (pathAndFrame?.frameRange?.start !== null) {
            if (product.granules[0].frame < pathAndFrame.frameRange.start) {
              return false;
            }
          }
          if (pathAndFrame?.frameRange?.end !== null) {
            if (product.granules[0].frame > pathAndFrame.frameRange.end) {
              return false;
            }
          }

          return true;
        });
      })
    );
  }

  private filterByProductType$(products$: Observable<SarviewsProduct[]>) {
    return combineLatest([
      products$,
      this.store$.select(filtersStore.getHyp3ProductTypes).pipe(
        map(jobTypes => jobTypes.map(jobType => jobType.id))
      )
    ]).pipe(
      map(([products, jobTypes]) => {
          if(jobTypes.length === 0) {
            return products;
          }

          return products.filter(product => jobTypes.includes(product.job_type));
        }
      )
    )
  }

  private ProductSortOrder$(products$: Observable<SarviewsProduct[]>) {
    return combineLatest([
      products$,
      this.store$.select(filtersStore.getSarviewsEventProductSorting)
    ]).pipe(
      map(([products, sorting]) => {
        const sortedProducts = [].concat(products);
        switch (sorting.sortType) {
          case EventProductSortType.FRAME:
            sortedProducts.sort((a, b) => {
              if (a.granules[0].frame < b.granules[0].frame) {
                return -1;
              }
              if (a.granules[0].frame > b.granules[0].frame) {
                return 1;
              }

              return 0;
            });
            break;
          case EventProductSortType.PATH:
            sortedProducts.sort((a, b) => {
              if (a.granules[0].path < b.granules[0].path) {
                return -1;
              }
              if (a.granules[0].path > b.granules[0].path) {
                return 1;
              }

              return 0;
            });
            break;
        }

        if (sorting.sortDirection === EventProductSortDirection.ASCENDING) {
          sortedProducts.reverse();
        }

        return sortedProducts;
      })
    );
  }

  public areEventProductsFiltered$(): Observable<Boolean> {
    return combineLatest(this.filteredEventProducts$(),
      this.store$.select(getSelectedSarviewsEventProducts)).pipe(
        map(([filtered, unfiltered]) => {
          if (!!unfiltered) {
            return !(filtered?.length === unfiltered.length);
          }
          return false;
        })
      );
  }

  public filterSarviewsEventsByName$(events$: Observable<SarviewsEvent[]>) {
    return combineLatest(
      [
        events$,
        this.store$.select(filtersStore.getSarviewsEventNameFilter).pipe(
            map(nameFilter => nameFilter?.toLowerCase()),
          )
      ]
    ).pipe(
      map(([events, nameFilter]) => {
        if (nameFilter === null || nameFilter === undefined || nameFilter === '') {
          return events;
        }

        return events.filter(
          event => {
            const isQuake = event.event_type.toLowerCase() === 'quake';
            const isVolcano = event.event_type.toLowerCase() === 'volcano';

            return event.description.toLowerCase().includes(nameFilter)
            || event.event_id.toLowerCase().includes(nameFilter)
            || event.event_type.toLowerCase().includes(nameFilter)
            || (!isVolcano ? (isQuake ? (event as models.SarviewsQuakeEvent).usgs_event_id?.includes(nameFilter) :
            true)
            : (event as models.SarviewsVolcanicEvent).smithsonian_event_id?.includes(nameFilter));
            });
      }
      )
    );
  }

    private filterByEventDate$(events$: Observable<SarviewsEvent[]>) {
      return combineLatest([
        events$,
        this.store$.select(filtersStore.getDateRange),
      ]
      ).pipe(
        debounceTime(0),
        map(
          ([events, dateRange]) => {
            const range = {
              start: moment(dateRange.start),
              end: moment(dateRange.end)
            };

            if (dateRange.start === null && dateRange.end === null) {
              return events;
            }

            return events.filter(scene => {
              if (dateRange.start === null && dateRange.end !== null) {
                return moment(scene.processing_timeframe.end) <= range.end ;
              } else if (dateRange.start !== null && dateRange.end === null) {
                return moment(scene.processing_timeframe.start) >= range.start ;
              } else {
                return (
                  moment(scene.processing_timeframe.start) >= range.start  &&
                  moment(scene.processing_timeframe.end) <= range.end
                );
              }
            });
          }

        )
      );
    }

    private filterByEventType$(events$: Observable<SarviewsEvent[]>) {
      return combineLatest([
        events$,
        this.store$.select(filtersStore.getSarviewsEventTypes)
      ]).pipe(
        map(
          ([events, types]) => {
            if (types.length === 0) {
              return events;
            }

            return events.filter(event => !!types.find(t => t === event.event_type.toLowerCase()));
          }
        )
      );
    }

    private filterByEventActivity$(events$: Observable<SarviewsEvent[]>) {
      return combineLatest([
        events$,
        this.store$.select(filtersStore.getSarviewsEventActiveFilter)
      ]).pipe(
        map(([events, activeOnly]) => {
          if (!activeOnly) {
            return events;
          }

          const currentDate = new Date();

          return events.filter( event => {
            if (!!event.processing_timeframe.end) {
              if (currentDate <= event.processing_timeframe.end) {
                return true;
              }
            } else {
              return true;
            }
            return false;
          });
        })
      );
    }

    private filterByEventMagnitude$(events$: Observable<SarviewsEvent[]>) {
      return combineLatest([
        events$,
        this.store$.select(filtersStore.getSarviewsMagnitudeRange),
      ]).pipe(
        map(([events, magRange]) => {
          {
            if (!magRange.start && !magRange.end) {
              return events;
            } else if (magRange.start === 0 && magRange.end === 10) {
              return events;
            }

            return events.filter(event => {
              if (event.event_type.toLowerCase() === 'quake') {
                const magEvent = <models.SarviewsQuakeEvent>event;
                const start = !!magRange.start ? magRange.start : 0;
                const end = !!magRange.end ? magRange.end : 10;

                return magEvent.magnitude <= end && magEvent.magnitude >= start;
              }

              return true;
              }
            );
          }
        })
      );
    }
}
