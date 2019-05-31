import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { filter, map, switchMap, tap, catchError } from 'rxjs/operators';

import { MapService } from './map/map.service';
import { AsfApiService } from './asf-api.service';
import { WktService } from './wkt.service';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class PolygonValidationService {
  constructor(
    private snackBar: MatSnackBar,
    private mapService: MapService,
    private asfApiService: AsfApiService,
    private wktService: WktService,
  ) { }

  public validate(): void {
    this.mapService.searchPolygon$.pipe(
      filter(p => !!p),
      switchMap(polygon => this.asfApiService.validate(polygon)),
      map(resp => {
        if (resp.error) {
          const { report, type } = resp.error;

          this.mapService.setDrawStyle(models.DrawPolygonStyle.INVALID);
          this.snackBar.open(
            report, 'INVALID POLYGON',
            { duration: 4000, }
          );

          return;
        } else {
          this.mapService.setDrawStyle(models.DrawPolygonStyle.VALID);

          const repairs = resp.repairs
            .filter(repair =>
              repair.type !== models.PolygonRepairTypes.ROUND
            );

          if (repairs.length === 0) {
            return resp.wkt;
          }

          const { report, type }  = resp.repairs.pop();

          if (type !== models.PolygonRepairTypes.WRAP) {
            this.snackBar.open(
              report, type,
              { duration: 4000, }
            );
          }

          const features = this.wktService.wktToFeature(
            resp.wkt,
            this.mapService.epsg()
          );

          this.mapService.setDrawFeature(features);
        }
      }),
      catchError((val, source) => source)
    ).subscribe(_ => _);
  }
}
