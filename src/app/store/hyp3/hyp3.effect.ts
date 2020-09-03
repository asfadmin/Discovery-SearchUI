import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest, of } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter, delay, catchError } from 'rxjs/operators';

import { Hyp3Service, AsfApiService, ProductService } from '@services';
import { AppState } from '../app.reducer';
import { SetScenes } from '../scenes/scenes.action';
import { OpenResultsMenu } from '../ui/ui.action';
import { Hyp3ActionType, SetJobs, SuccessfulJobSumbission, ErrorJobSubmission, SubmitJob, SetUser } from './hyp3.action';
import { SetSearchList } from '../filters/filters.action';
import { MakeSearch } from '../search/search.action';

import { SearchType } from '@models';

@Injectable()
export class Hyp3Effects {
  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private hyp3Service: Hyp3Service,
    private snackbar: MatSnackBar,
    public asfApiService: AsfApiService,
    private productService: ProductService,
  ) {}

  private onSetJobs = createEffect(() => this.actions$.pipe(
    ofType<SetJobs>(Hyp3ActionType.SET_JOBS),
    delay(200),
    map(action => new MakeSearch()),
  ));

  private loadUser = createEffect(() => this.actions$.pipe(
    ofType(Hyp3ActionType.LOAD_USER),
    switchMap(_ => this.hyp3Service.getUser$()),
    map(user => new SetUser(user))
  ));

  private submitJob = createEffect(() => this.actions$.pipe(
    ofType<SubmitJob>(Hyp3ActionType.SUBMIT_JOB),
    switchMap(action => this.hyp3Service.submitJob$(action.payload).pipe(
      map((jobs: any) => {
        return new SuccessfulJobSumbission();
      }),
      catchError(err => of(new ErrorJobSubmission())),
    ))
  ));

  private successfulJobSubmission = createEffect(() => this.actions$.pipe(
    ofType(Hyp3ActionType.SUCCESSFUL_JOB_SUBMISSION),
    map(_ => this.snackbar.open(
      'Job successfully submitted', 'RTC_GAMMA',
      { duration: 3000 }
    ))
  ), {dispatch: false});

  private errorJobSubmission = createEffect(() => this.actions$.pipe(
    ofType<SubmitJob>(Hyp3ActionType.ERROR_JOB_SUBMISSION),
    map(action => this.snackbar.open(
      'Failed to submit job', 'RTC_GAMMA',
      { duration: 3000 }
    ))
  ), {dispatch: false});
}
