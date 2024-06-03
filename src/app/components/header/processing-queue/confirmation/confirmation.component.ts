import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { of, from } from 'rxjs';
import { tap, catchError, concatMap, finalize } from 'rxjs/operators';

import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public jobTypesWithQueued = [];
  public processingOptions: models.Hyp3ProcessingOptions;
  public projectName: string;
  public validateOnly: boolean;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    public hyp3: services.Hyp3Service,
    private notificationService: services.NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: models.ConfirmationDialogData
  ) { }

  ngOnInit(): void {
    this.jobTypesWithQueued = this.data.jobTypesWithQueued;
    this.processingOptions = this.data.processingOptions;
    this.projectName = this.data.projectName;
    this.validateOnly = this.data.validateOnly;
  }

  public onToggleJobType(tabQueue): void {
    this.jobTypesWithQueued = this.jobTypesWithQueued.map(
      tab => {
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
      }
    );
  }

  public amountSelected(jobTypes): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map(jobType => jobType.jobs.length)
      .reduce((a, b) => a + b, 0);
  }

  public creditsSelected(jobTypes): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map(jobType => jobType.creditTotal)
      .reduce((a, b) => a + b, 0);
  }

  public onCancelQueue(): void {
    this.dialogRef.close();
  }

  public onSubmitQueue(): void {
    //this.dialogRef.close(this.jobTypesWithQueued);
    const jobTypesWithQueued = this.jobTypesWithQueued;

    const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions: this.processingOptions
    });

    const batchSize = 20;
    const hyp3JobRequestBatches = this.chunk(hyp3JobsBatch, batchSize);
    const total = hyp3JobRequestBatches.length;
    let current = 0;

    // this.isQueueSubmitProcessing = true;
    let progress = null;

    from(hyp3JobRequestBatches).pipe(
      concatMap(batch => this.hyp3.submitJobBatch$({ jobs: batch, validate_only: validateOnly }).pipe(
        catchError(resp => {
          if (resp.error) {
            if (resp.error.detail === 'No authorization token provided' || resp.error.detail === 'Provided apikey is not valid') {
              this.notificationService.error('Your authorization has expired. Please sign in again.', 'Error', {
                timeOut: 0,
                extendedTimeOut: 0,
                closeButton: true,
            });
            } else {
              this.notificationService.error( resp.error.detail, 'Error', {
                timeOut: 0,
                extendedTimeOut: 0,
                closeButton: true,
              });
            }
          }

          return of({jobs: null});
        }),
      )),
      tap(_ => {
        current += 1;
        progress = Math.floor((current / total) * 100);
      }),
      finalize(() => {
        progress = null;
        // this.isQueueSubmitProcessing = false;

        this.store$.dispatch(new hyp3Store.LoadUser());
        let jobText;
        if (this.allJobs.length === 0) {
          this.dialogRef.close();
          jobText = hyp3JobsBatch.length > 1 ? `${hyp3JobsBatch.length} Jobs` : 'Job';
        } else if (this.allJobs.length !== hyp3JobsBatch.length) {
            const submittedJobs = Math.abs(hyp3JobsBatch.length - this.allJobs.length);
            jobText = submittedJobs > 1 ? `${submittedJobs} Jobs` : 'Job';
        }
        if (jobText) {
          this.notificationService.info(`Click to view Submitted Products.`, `${jobText} Submitted`, {
            closeButton: true,
            disableTimeOut: true,
          }).onTap.subscribe(() => {
            const searchType = models.SearchType.CUSTOM_PRODUCTS;
            this.store$.dispatch(new searchStore.SetSearchType(searchType));
          });
        }
      }),
    ).subscribe(
      (resp: any) => {
        if (resp.jobs === null) {
          return;
        }

        const successfulJobs = resp.jobs.map(job => ({
          granules: job.job_parameters.granules.map(g => ({name: g})),
          job_type: models.hyp3JobTypes[job.job_type]
        }));

        this.store$.dispatch(new queueStore.RemoveJobs(successfulJobs));

        const jobsInTab = this.allJobs.filter(
          job => job.job_type.id === this.selectedJobTypeId
        );

        if (jobsInTab.length === 0) {
          this.setNextTabIndex(models.hyp3JobTypes[this.selectedJobTypeId]);
        }
      }
    );
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
