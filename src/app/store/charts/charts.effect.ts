import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as chartActions from './charts.action';
import { NetcdfService } from '@services';
import { filter, map, tap } from 'rxjs';
import * as d3 from 'd3';

@Injectable()
export class ChartsEffects {

    updateTimeseriesCache = createEffect(() => this.actions$.pipe(
        ofType(chartActions.removeTimeseriesState),
        tap(({uuid}) => this.netcdfService.removeFromCache(uuid)),
    ), {dispatch: false});

    assignColor = createEffect(() => this.actions$.pipe(
        ofType(chartActions.addTimeseriesState),
        filter(action => action.item.color !== null),
        map((new_series) => {
            return chartActions.setTimeseriesColor({'uuid': new_series.item.uuidSeries, 'color': d3.schemeCategory10[(new_series.item.seriesNumber-1) % 10].toString()})
        })
    ))

    constructor(
        private actions$: Actions,
        private netcdfService: NetcdfService
      ) {}
}
