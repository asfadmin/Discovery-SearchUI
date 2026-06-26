import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService, NotificationService } from '@services';
import {
  Observable,
  Subject,
  catchError,
  delay,
  map,
  of,
  retryWhen,
  scan,
} from 'rxjs';
// import WebGLTileLayer from 'ol/layer/WebGLTile';
import ImageLayer from 'ol/layer/Image';
// import Static from 'ol/source/ImageStatic';
// import { TimeSeriesResult } from '@models';
import ImageSource from 'ol/source/Image';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { FlightDirection, TimeseriesSubframe } from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { setTimeseriesValid } from '@store/charts';
// import { timeseriesChartItemState } from '@models';

@Injectable({
  providedIn: 'root',
})
export class NetcdfService {
  private env = inject(EnvironmentService);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private store$ = inject<Store<AppState>>(Store);
  private bucket = 'asf-cumulus-prod-opera-products';
  private timeSeriesEndpoint = '/timeseries';
  private frameIntersectionEndpoint = '/frame_intersection';
  public layers: {
    feature: Feature<Geometry>;
    browse: ImageLayer<ImageSource>;
  }[] = [];

  private ascendingCache = {};
  private descendingCache = {};
  private totalKeys = [];
  private maxCacheSize = 10;
  private csvHeaders =
    'name, geometry, date (mm/dd/yr), short wavelength displacement, source file';

  public cacheUpdated = new Subject<string>();

  private get apiUrl() {
    return this.env.currentEnv.displacement_api;
  }
  private getTargetCache(flightDir: FlightDirection) {
    return flightDir === FlightDirection.ASCENDING
      ? this.ascendingCache
      : this.descendingCache;
  }
  public getCache(flightDir: FlightDirection = FlightDirection.ASCENDING) {
    return this.getTargetCache(flightDir);
  }

  public removeFromCache(wkt: string): void {
    for (const cache of [this.ascendingCache, this.descendingCache]) {
      if (cache.hasOwnProperty(wkt)) {
        delete cache[wkt];
      }
    }
    this.cacheUpdated.next(wkt);
  }

  private handleRetry<T>(source: Observable<T>): Observable<T> {
    return source.pipe(
      retryWhen((e) =>
        e.pipe(
          scan((errorCount, error) => {
            if (error.status !== 0) {
              throw error;
            }
            if (errorCount >= 3) {
              throw error;
            }
            return errorCount + 1;
          }, 0),
          delay(1000),
        ),
      ),
    );
  }

  public getTimeSeries(
    frame: TimeseriesSubframe,
    flightDirection = FlightDirection.ASCENDING,
  ): Observable<any> {
    const index_id = frame.uuid;

    const target_cache = this.getTargetCache(flightDirection);

    if (target_cache.hasOwnProperty(index_id)) {
      if (
        target_cache[index_id]?.error === null ||
        target_cache[index_id]?.error === undefined
      ) {
        this.store$.dispatch(
          setTimeseriesValid({ uuid: frame.uuid, valid: true }),
        );
        return of(target_cache[index_id]);
      } else {
        const errorDetails =
          target_cache[index_id]?.error?.error.detail ??
          'No details, try again.';
        this.store$.dispatch(
          setTimeseriesValid({
            uuid: frame.uuid,
            valid: false,
            error: errorDetails,
          }),
        );
        return of();
      }
    } else {
      return this.http
        .post(
          `${this.apiUrl}${this.timeSeriesEndpoint}`,
          {
            wkt: frame.wkt,
            bucket: this.bucket,
            polarization: 'VV',
            flightDirection: flightDirection,
            // 'frame_id': frame.number
          },
          { responseType: 'json' },
        )
        .pipe(
          this.handleRetry,
          catchError((error) => {
            const errorDetails = error.error.detail ?? 'No details, try again.';
            this.notificationService.error(
              errorDetails,
              'Timeseries Service Error',
            );

            this.store$.dispatch(
              setTimeseriesValid({
                uuid: frame.uuid,
                valid: false,
                error: errorDetails,
              }),
            );
            return of({ error });
          }),
          map((response) => {
            if (response) {
              (response as any).aoi = frame.wkt;
            }
            target_cache[index_id] = response;
            this.totalKeys.push(index_id);
            if (this.totalKeys.length > this.maxCacheSize) {
              const deleted = this.totalKeys.splice(0);
              delete target_cache[deleted[0]];
            }
            this.cacheUpdated.next(index_id);
            if (response && !(response as any)?.error) {
              this.store$.dispatch(
                setTimeseriesValid({ uuid: frame.uuid, valid: true }),
              );
            } else {
              response = null;
            }

            return response;
          }),
        );
    }
  }

  public getFrames(wkt: string, flightDir: FlightDirection) {
    return this.http
      .post(`${this.apiUrl}${this.frameIntersectionEndpoint}`, {
        wkt: wkt,
        flightDirection: flightDir.toLowerCase(),
      })
      .pipe(
        map((response: Record<number, TimeseriesSubframe>) => {
          return response;
        }),
      );
  }

  // series, longitude, latitude, date (mm/dd/yr), short wavelength displacement, source file
  // series 1, 1.0, 2.0,  05/14/2020, 0.500, granule1.nc
  // ...
  public toCSV(seriesData: Record<string, object[]>): string {
    let output = `${this.csvHeaders}\n`;
    const sortedSeriesKeys = Object.keys(seriesData).sort((s1, s2) =>
      s1 < s2 ? -1 : 1,
    );
    for (const seriesNumber of sortedSeriesKeys) {
      for (const timestep of seriesData[seriesNumber]) {
        // Skip string markers like 'aoi' or 'mean'
        if (typeof timestep === 'string') {
          continue;
        }

        if (typeof timestep === 'object' && timestep !== null) {
          let dateDisplay = '';
          // Format date if it exists
          if (timestep['date']) {
            const d = new Date(timestep['date']);

            const month = d.getUTCMonth() + 1;
            let monthDisplay = month.toString();
            if (month < 10) {
              monthDisplay = `0${monthDisplay}`;
            }
            const day = d.getUTCDate();
            let dayDisplay = day.toString();
            if (day < 10) {
              dayDisplay = `0${dayDisplay}`;
            }
            dateDisplay = `${monthDisplay}/${dayDisplay}/${d.getUTCFullYear()}`;
          }
          output += `Series ${seriesNumber}, ${timestep['wkt']}, ${dateDisplay}, ${timestep['short_wavelength_displacement']}, ${timestep['fileName']}\n`;
        }
      }
    }
    return output;
  }
}
