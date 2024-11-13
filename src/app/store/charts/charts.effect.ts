import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as chartActions from './charts.action';
import { NetcdfService } from '@services';
import { 
    filter,
    // filter, 
    map, tap } from 'rxjs';
import * as d3 from 'd3';
@Injectable()
export class ChartsEffects {
    private colorPalette = d3.scaleOrdinal()
    .range(d3.schemeSet2);

    updateTimeseriesCache = createEffect(() => this.actions$.pipe(
        ofType(chartActions.removeTimeseriesState),
        tap(({wkt}) => this.netcdfService.removeFromCache(wkt)),
    ), {dispatch: false});
    
    assignColor = createEffect(() => this.actions$.pipe(
        ofType(chartActions.addTimeseriesState),
        filter(action => action.item.color !== null),
        map((new_series) => {
            return chartActions.setTimeseriesColor({'wkt': new_series.item.wkt, 'color': this.colorPalette(new_series.item.seriesNumber.toString()) as string})
        })
    ))
    constructor(
        private actions$: Actions,
        private netcdfService: NetcdfService
      ) {}
}