import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import { map, switchMap, delay, catchError } from 'rxjs/operators';

import { Hyp3Service, AsfApiService } from '@services';
import {
  Hyp3ActionType, SetJobs, SuccessfulJobSumbission,
  ErrorJobSubmission, SubmitJob, SetUser, ErrorLoadingUser
} from './hyp3.action';
import { MakeSearch } from '../search/search.action';

@Injectable()
export class Hyp3Effects {
  constructor(
    private actions$: Actions,
    private hyp3Service: Hyp3Service,
    private snackbar: MatSnackBar,
    public asfApiService: AsfApiService,
  ) {}

  public onSetJobs = createEffect(() => this.actions$.pipe(
    ofType<SetJobs>(Hyp3ActionType.SET_JOBS),
    delay(200),
    map(_ => new MakeSearch()),
  ));

  public loadUser = createEffect(() => this.actions$.pipe(
    ofType(Hyp3ActionType.LOAD_USER),
    switchMap(_ => this.hyp3Service.getUser$().pipe(
      map(user => new SetUser(user)),
      catchError(() => {
        return of(new ErrorLoadingUser());
      })
    ))
  ));

  public submitJob = createEffect(() => this.actions$.pipe(
    ofType<SubmitJob>(Hyp3ActionType.SUBMIT_JOB),
    switchMap(action => this.hyp3Service.submitJob$(action.payload).pipe(
      map(_ => new SuccessfulJobSumbission()
      ),
      catchError(_ => of(new ErrorJobSubmission())),
    ))
  ));

  public successfulJobSubmission = createEffect(() => this.actions$.pipe(
    ofType(Hyp3ActionType.SUCCESSFUL_JOB_SUBMISSION),
    map(_ => this.snackbar.open(
      'Job successfully submitted', 'RTC_GAMMA',
      { duration: 3000 }
    ))
  ), {dispatch: false});

  public errorJobSubmission = createEffect(() => this.actions$.pipe(
    ofType<SubmitJob>(Hyp3ActionType.ERROR_JOB_SUBMISSION),
    map(_ => this.snackbar.open(
      'Failed to submit job', 'RTC_GAMMA',
      { duration: 3000 }
    ))
  ), {dispatch: false});
}
