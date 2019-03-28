import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { MissionActionType, SetMissions } from './mission.action';

import * as services from '@services';
import * as models from '@models';

@Injectable()
export class MissionEffects {
  constructor(
    private actions$: Actions,
    private asfApiService: services.AsfApiService,
  ) {}

  @Effect()
  private loadMissions: Observable<SetMissions> = this.actions$.pipe(
    ofType(MissionActionType.LOAD_MISSIONS),
    switchMap(action => combineLatest(
      this.asfApiService.missionSearch(models.MissionPlatform.S1_BETA).pipe(
        map(resp => ({[models.MissionPlatform.S1_BETA]: resp.result}))
      ),
      this.asfApiService.missionSearch(models.MissionPlatform.AIRSAR).pipe(
        map(resp => ({[models.MissionPlatform.AIRSAR]: resp.result}))
      ),
      this.asfApiService.missionSearch(models.MissionPlatform.UAVSAR).pipe(
        map(resp => ({[models.MissionPlatform.UAVSAR]: resp.result}))
      )
    ).pipe(
      map(missions => missions.reduce(
        (allMissions, mission) => ({ ...allMissions, ...mission }),
        {}
      )),
      map(missionsByPlatform => new SetMissions(missionsByPlatform))
    )
    )
  );
}
