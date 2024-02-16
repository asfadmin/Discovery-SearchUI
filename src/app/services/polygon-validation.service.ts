import { Injectable } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';
import { filter, map, switchMap, catchError, tap } from 'rxjs/operators';

import { MapService } from './map/map.service';
import { AsfApiService } from './asf-api.service';
import { WktService } from './wkt.service';

import * as models from '@models';
import { NotificationService } from './notification.service';
import { Feature } from 'ol';
import { Geometry, Polygon } from 'ol/geom';
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

  public BBOX$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(null)

  public validate(): void {
    this.mapService.searchPolygon$.pipe(
      tap(wkt => {
        if(wkt == null) {
          this.BBOX$.next(null);
        }
      }),
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
          this.updateBBox(resp);
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

  public isRectangle(feature: Feature<Geometry>): boolean {
    const geom = feature?.getGeometry()
    if (geom instanceof Polygon) {
      let points = (geom as Polygon).getCoordinates() ?? []
      const extent = (geom as Polygon).getExtent()
      for (const point of points[0][0]) {
        if (!extent.includes(point)) {
          return false;
        }
      }
      return !!points && points[0].length === 5
    }
    return false;
  }

  public getRectangleBbox(feature: Feature<Geometry>, epsg: string): number[] {
    // Attempts to get the bounding box of a rectangular polygon
    if (this.isRectangle(feature)) {
      const clonedFeature = this.cloneFeature(feature.clone());
      const rectangle = clonedFeature.getGeometry() as Polygon;
      return this.getBbox(rectangle, epsg);
    }
    return [];
  }

  private cloneFeature(feature: Feature<Geometry>): Feature<Geometry> {
    const clonedFeature = feature.clone();
    const clonedProperties = JSON.parse(JSON.stringify(feature.getProperties()));
    clonedProperties.geometry = clonedFeature.getGeometry();
    clonedFeature.setProperties(clonedProperties, true);
    return clonedFeature;
  }

  private getBbox(rectangle: Polygon, epsg: string) {
    rectangle.transform(epsg, 'EPSG:4326');
    const outerHull = rectangle.getLinearRing(0).getCoordinates().slice(0, 4);
    return this.wrapBbox([...outerHull[0], ...outerHull[2]]);
  }

  private wrapBbox(bbox: number[]): number[] {
    // bounds = [(x + 180) % 360 - 180
    return bbox.map(value => {
      if (Math.abs(value) > 180) {
        value = (value + 180) % 360 - 180
      }
      return value;
    }
    );
  }

  public updateBBox(repairResponse: models.WKTRepairResponse): void {
    if (!this.isRectangle(this.wktService.wktToFeature(repairResponse.wkt.wrapped, this.mapService.epsg()))) {
      this.BBOX$.next(null);
    }
    // if (this.mapService.mapView.view == views.equatorial().view) {
      const unwrapped = this.wktService.wktToFeature(repairResponse.wkt.unwrapped, this.mapService.epsg())
      this.BBOX$.next(this.getBbox(unwrapped.getGeometry() as Polygon, this.mapService.epsg()));
    // } else {
    //   this.BBOX$.next(null);
    //   // const wrapped = this.wktService.wktToFeature(repairResponse.wkt.wrapped, this.mapService.epsg())
    //   // this.BBOX$.next(this.getBbox(wrapped.getGeometry() as Polygon, this.mapService.epsg()));
    // }
    
  }
}
