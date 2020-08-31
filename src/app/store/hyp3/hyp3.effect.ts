import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';

import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, startWith, switchMap, tap, filter, delay } from 'rxjs/operators';

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

  private loadJobs = createEffect(() => this.actions$.pipe(
    ofType(Hyp3ActionType.LOAD_JOBS),
    switchMap(_ => this.hyp3Service.getJobs$()),
    switchMap(jobs => {
      const granules = jobs.map(
        job => job.job_parameters.granule
      ).join(',');

      return this.asfApiService.query<any[]>({ 'granule_list': granules }).pipe(
        map(results => this.productService.fromResponse(results)
          .filter(product => !product.metadata.productType.includes('METADATA'))
          .reduce((products, product) => {
            products[product.name] = product;
            return products;
          } , {})
        ),
        map(products => {
          const virtualProducts = jobs.map(job => {
            const product = products[job.job_parameters.granule];
            const jobFile = job.files[0];

            return {
              ...product,
              browses: job.browse_images ? job.browse_images : [''],
              thumbnail: job.thumbnail_images ? job.thumbnail_images[0] : '',
              productTypeDisplay: job.job_type,
              downloadUrl: jobFile.url,
              bytes: jobFile.size,
              metadata: {
                ...product.metadata,
                productType: job.job_type,
                job
              },
            };
          });

          return virtualProducts;
        })
      );
    }),
    switchMap(products => [
      new SetScenes({ searchType: SearchType.CUSTOM_PRODUCTS, products }),
      new OpenResultsMenu(),
    ])
  ));

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
        const [job] = jobs.jobs;

        if ( job.status_code === 'PENDING' ) {
          return new SuccessfulJobSumbission();
        } else {
          return new ErrorJobSubmission();
        }
      })
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
      'Fail to submit job', 'RTC_GAMMA',
      { duration: 3000 }
    ))
  ), {dispatch: false});
}
