import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { Hyp3Service } from '@services';
import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
import * as models from '@models';
import * as services from '@services';

@Component({
  selector: 'app-processing-queue',
  templateUrl: './processing-queue.component.html',
  styleUrls: ['./processing-queue.component.scss']
})
export class ProcessingQueueComponent implements OnInit {
  public jobs: models.QueuedHyp3Job[] = [];
  public selected: models.Hyp3Job;
  public selectedJobId: string = null;
  public user = '';
  public remaining = 0;
  public limit = 0;
  public areJobsLoading = false;
  public isQueueSubmitProcessing = false;
  public previousQueue: any[] | null = null;

  public radiometry = 'gamma0';
  public scale = 'power';
  public projectName = '';
  public demMatching = false;
  public includeDem = false;
  public includeIncMap = false;
  public speckleFilter = false;

  constructor(
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
    private snackBar: MatSnackBar,
    private store$: Store<AppState>,
    private hyp3: services.Hyp3Service,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(new hyp3Store.LoadUser());

    this.store$.select(queueStore.getQueuedJobs).subscribe(jobs => {
      this.jobs = jobs;
    });

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.user = user.user_id;
        this.remaining = user.quota.remaining;
        this.limit = user.quota.limit;
      }
    );
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }

  public onSelectJob(job: models.Hyp3Job): void {
    this.selectedJobId = job.job_id;
    this.selected = job;
  }

  public daysUntilExpiration(expiration_time: moment.Moment): string {
    const current = moment();

    return `${current.diff(expiration_time, 'days')} days`;
  }

  public onSubmitQueue(): void {
    const options = {
      dem_matching: this.demMatching,
      include_dem: this.includeDem,
      include_inc_map: this.includeIncMap,
      radiometry: this.radiometry,
      scale: this.scale,
      speckle_filter: this.speckleFilter,
    };

    const hyp3JobsBatch = this.jobs.map(job => {
      const jobOptions: any = {
        job_type: job.job_type,
        job_parameters: {
          ...options,
          granules: job.granules.map(granule => granule.name),
        }
      };

      if (this.projectName !== '') {
        jobOptions.name = this.projectName;
      }

      return jobOptions;
    });

    this.isQueueSubmitProcessing = true;

    this.hyp3.submiteJobBatch$({ jobs: hyp3JobsBatch }).pipe(
      catchError(_ => of({jobs: []})),
      tap(_ => this.isQueueSubmitProcessing = false),
    ).subscribe(
      (resp: any) => {
        this.snackBar.open(`${resp.jobs.length} jobs successfully submitted`, 'Submit', {
          duration: 5000,
        });

        this.store$.dispatch(new queueStore.ClearProcessingQueue());
        this.dialogRef.close();
      }
    );
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.store$.dispatch(new queueStore.RemoveJob(job));
  }

  public onClearJobQueue(jobs): void {
    this.previousQueue = jobs;
    this.store$.dispatch(new queueStore.ClearProcessingQueue());
  }

  public onRestoreJobQueue(previousJobs): void {
    this.store$.dispatch(new queueStore.AddJobs(previousJobs));
    this.previousQueue = null;
  }
}
