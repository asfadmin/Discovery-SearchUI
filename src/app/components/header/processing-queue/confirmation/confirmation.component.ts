import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { of, from } from 'rxjs';
import { tap, catchError, concatMap, finalize } from 'rxjs/operators';

import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';

import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ConfirmationComponent>>(MatDialogRef);
  hyp3 = inject(services.Hyp3ApiService);
  hyp3JobService = inject(services.Hyp3JobService);
  private store$ = inject<Store<AppState>>(Store);
  private notificationService = inject(services.NotificationService);
  data = inject<models.ConfirmationDialogData>(MAT_DIALOG_DATA);

  public allJobs: models.QueuedHyp3Job[] = [];
  public jobTypesWithQueued: models.JobTypesWithQueued[] = [];
  public processingOptions: models.Hyp3ProcessingOptions;
  public projectName: string;
  public validateOnly: boolean;

  public isQueueSubmitProcessing = false;
  public progress = null;

  ngOnInit(): void {
    this.jobTypesWithQueued = this.data.jobTypesWithQueued;
    this.processingOptions = this.data.processingOptions;
    this.validateOnly = this.data.validateOnly;
    this.allJobs = this.jobTypesWithQueued.reduce((total, jobs) => {
      total = [...total, ...jobs.jobs];

      return total;
    }, []);
    this.store$.dispatch(new hyp3Store.SetProcessingProjectName(null));

    this.store$.select(hyp3Store.getProcessingProjectName).subscribe((name) => {
      this.projectName = name;
    });
  }

  public onToggleJobType(tabQueue: models.JobTypesWithQueued): void {
    this.jobTypesWithQueued = this.jobTypesWithQueued.map((tab) => {
      if (tab.jobType.id === tabQueue.jobType.id) {
        return {
          jobType: tab.jobType,
          selected: !tab.selected,
          jobs: tab.jobs,
          creditTotal: tab.creditTotal,
        };
      } else {
        return tab;
      }
    });
  }

  public amountSelected(jobTypes: models.JobTypesWithQueued[]): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map((jobType) => jobType.jobs.length)
      .reduce((a, b) => a + b, 0);
  }

  public creditsSelected(jobTypes: models.JobTypesWithQueued[]): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map((jobType) => jobType.creditTotal)
      .reduce((a, b) => a + b, 0);
  }

  public onCancelQueue(): void {
    this.dialogRef.close();
  }

  public onSubmitQueue(): void {
    const jobTypesWithQueued = this.jobTypesWithQueued;

    const hyp3JobsBatch = this.hyp3JobService.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions: this.processingOptions,
    });

    const batchSize = 20;
    const hyp3JobRequestBatches = this.chunk(hyp3JobsBatch, batchSize);
    const total = hyp3JobRequestBatches.length;
    let current = 0;

    this.isQueueSubmitProcessing = true;
    this.progress = null;

    from(hyp3JobRequestBatches)
      .pipe(
        concatMap((batch) =>
          this.hyp3
            .submitJobBatch$({ jobs: batch, validate_only: this.validateOnly })
            .pipe(
              catchError((resp) => {
                if (resp.error) {
                  if (
                    resp.error.detail === 'No authorization token provided' ||
                    resp.error.detail === 'Provided apikey is not valid'
                  ) {
                    this.notificationService.error(
                      'Your authorization has expired. Please sign in again.',
                      'Error',
                      {
                        timeOut: 0,
                        extendedTimeOut: 0,
                        closeButton: true,
                      },
                    );
                  } else {
                    this.notificationService.error(resp.error.detail, 'Error', {
                      timeOut: 0,
                      extendedTimeOut: 0,
                      closeButton: true,
                    });
                  }
                }

                return of({ jobs: null });
              }),
            ),
        ),
        tap((_) => {
          current += 1;
          this.progress = Math.floor((current / total) * 100);
        }),
        finalize(() => {
          this.progress = null;
          this.isQueueSubmitProcessing = false;

          this.store$.dispatch(new hyp3Store.LoadUser());
          let numJobsSubmitted: number;

          if (this.allJobs.length !== hyp3JobsBatch.length) {
            numJobsSubmitted = Math.abs(
              hyp3JobsBatch.length - this.allJobs.length,
            );
          } else {
            numJobsSubmitted = hyp3JobsBatch.length;
          }

          const jobText =
            numJobsSubmitted > 1 ? `${numJobsSubmitted} Jobs` : 'Job';

          this.notificationService
            .info(`Click to view Submitted Products.`, `${jobText} Submitted`, {
              closeButton: true,
              disableTimeOut: true,
            })
            .onTap.subscribe(() => {
              const searchType = models.SearchType.CUSTOM_PRODUCTS;
              this.store$.dispatch(new searchStore.SetSearchType(searchType));
            });

          this.dialogRef.close(this.jobTypesWithQueued);
        }),
      )
      .subscribe((resp: any) => {
        if (resp.jobs === null) {
          return;
        }

        const successfulJobs = resp.jobs.map((job) => ({
          granules: this.hyp3JobService
            .getAllGranules(job)
            .map((g) => ({ name: g })),
          job_type: models.hyp3JobTypes[job.job_type],
        }));

        this.store$.dispatch(new queueStore.RemoveJobs(successfulJobs));
      });
  }

  private chunk(arr, chunkSize) {
    if (chunkSize <= 0) {
      throw new Error('Invalid chunk size');
    }

    const R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }

    return R;
  }
}
