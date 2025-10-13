import { Injectable, inject } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, delay, catchError } from 'rxjs/operators';

import { Hyp3ApiService, AsfApiService } from '@services';
import {
  Hyp3ActionType,
  SetJobs,
  SetUser,
  ErrorLoadingUser,
  SetCosts,
} from './hyp3.action';
import { MakeSearch } from '../search/search.action';

@Injectable()
export class Hyp3Effects {
  private actions$ = inject(Actions);
  private hyp3Service = inject(Hyp3ApiService);
  asfApiService = inject(AsfApiService);

  public onSetJobs = createEffect(() =>
    this.actions$.pipe(
      ofType<SetJobs>(Hyp3ActionType.SET_JOBS),
      delay(200),
      map((_) => new MakeSearch()),
    ),
  );

  public loadUser = createEffect(() =>
    this.actions$.pipe(
      ofType(Hyp3ActionType.LOAD_USER),
      switchMap((_) =>
        this.hyp3Service.getUser$().pipe(
          map((user) => new SetUser(user)),
          catchError(() => {
            return of(new ErrorLoadingUser());
          }),
        ),
      ),
    ),
  );

  public loadCosts = createEffect(() =>
    this.actions$.pipe(
      ofType(Hyp3ActionType.LOAD_COSTS),
      switchMap((_) =>
        this.hyp3Service.getCosts$().pipe(map((costs) => new SetCosts(costs))),
      ),
    ),
  );
}
