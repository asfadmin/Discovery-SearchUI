import { Injectable } from '@angular/core';

import { of } from 'rxjs';
import { filter, map, switchMap, catchError } from 'rxjs/operators';

import { MapService } from './map/map.service';
import { AsfApiService } from './asf-api.service';
import { WktService } from './wkt.service';

import * as models from '@models';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class PolygonValidationService {
  private polygons: Set<string> = new Set([]);
  private isUpdatedFromRepair = false;

  constructor(
    private mapService: MapService,
    private asfApiService: AsfApiService,
    private wktService: WktService,
    private notificationService: NotificationService,
  ) { }

  public validate(): void {
    this.mapService.searchPolygon$.pipe(
      filter(_ => {
        const skip = !this.isUpdatedFromRepair;
        this.isUpdatedFromRepair = false;

        return skip;
      }),
      filter(p => !!p || this.polygons.has(p)),
      // filter(([_, polygon]) => ),
      switchMap(wkt => {
        return this.asfApiService.validate(wkt).pipe(
          catchError(_ => of(null))
        );

      }),
      filter(resp => !!resp),
      map(resp => {
        const error = this.getErrorFrom(resp);

        if (error) {
          this.displayDrawError(error);
        } else {
          this.setValidPolygon(resp);
        }
      }),
      catchError((_, source) => source)
    ).subscribe(_ => _);
  }

  private getErrorFrom(resp) {
    if (resp.error) {
      return resp.error;
    } else if (resp.errors) {
      return resp.errors.pop();
    } else {
      return null;
    }
  }

  private displayDrawError(error) {
    const { report } = error;

    this.mapService.setDrawStyle(models.DrawPolygonStyle.INVALID);
    this.notificationService.info(
      report, 'Invalid Polygon',
      { timeOut: 4000, }
    );
  }

  private setValidPolygon(resp: models.WKTRepairResponse) {
    this.polygons.add(resp.wkt.unwrapped);
    this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID);

    const repairs = resp.repairs
      .filter(repair =>
        repair.type !== models.PolygonRepairTypes.ROUND
      );

    if (repairs.length === 0) {
      return resp.wkt.unwrapped;
    }

    const { report, type } = resp.repairs.pop();

    if (type !== models.PolygonRepairTypes.WRAP && type !== models.PolygonRepairTypes.REVERSE) {
      this.notificationService.info(
        report, type,
        { timeOut: 4000, }
      );
    }

    this.isUpdatedFromRepair = true;
    const features = this.wktService.wktToFeature(
      resp.wkt.unwrapped,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);
  }
}
