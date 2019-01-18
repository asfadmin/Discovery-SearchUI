import { Injectable  } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';

import { AppState } from '../app.reducer';

import * as fromGranuleActions from './granules.action';
import * as models from '../../models';
import { AsfApiService } from '../../services';

@Injectable()
export class GranulesEffects {
  constructor(
    private asfapi: AsfApiService,
    private actions$: Actions
  ) {}

  @Effect()
  private query: Observable<Action> = this.actions$
    .pipe(
      ofType<fromGranuleActions.QueryApi>(fromGranuleActions.GranulesActionType.QUERY),
      switchMap(action => this.asfapi.query(action.payload)
        .pipe(
          map(setGranules),
          catchError((err) => of(new fromGranuleActions.QueryError(
            `Api Query failed to load results. ERROR: ${err['message']}`
          )))
        )),
    );
}

const setGranules =
  (resp: any) => new fromGranuleActions.SetGranules(
    resp[0].map(
      (g: any): models.Sentinel1Product => ({
        name: g.granuleName,
        downloadUrl: g.downloadUrl,
        bytes: +g.sizeMB * 1000000,
        platform: g.platform,
        browse: g.browse || 'https://datapool.asf.alaska.edu/BROWSE/SB/S1B_EW_GRDM_1SDH_20170108T192334_20170108T192434_003761_00676D_4E7B.jpg',
        metadata: getMetadataFrom(g)
      })
    )
  );

const getMetadataFrom = (g: any): models.Sentinel1Metadata => {
  return {
      date:  fromCMRDate(g.processingDate),
      polygon: g.stringFootprint,

      beamMode: <models.Sentinel1BeamMode>g.beamMode,
      polarization: <models.Sentinel1Polarization>g.polarization,
      flightDirection: <models.FlightDirection>g.flightDirection,
      frequency: g.frequency,

      path: +g.relativeOrbit,
      frame:  +g.frameNumber,
      absoluteOrbit: +g.absoluteOrbit
  };
};

const fromCMRDate = (dateString: string): Date => {
  return new Date(dateString);
};
