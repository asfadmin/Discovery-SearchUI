import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as chartActions from './charts.action';
import { NetcdfService } from '@services';
import { tap } from 'rxjs';
@Injectable()
export class ChartsEffects {
    updateTimeseriesCache = createEffect(() => this.actions$.pipe(
        ofType(chartActions.removeTimeseriesState),
        tap(({wkt}) => this.netcdfService.removeFromCache(wkt)),
    ), {dispatch: false});
    
    constructor(
        private actions$: Actions,
        private netcdfService: NetcdfService
      ) {}
}