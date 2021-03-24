import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { QueueSubmitComponent } from './queue-submit/queue-submit.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as moment from 'moment';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
import * as userStore from '@store/user'; import * as models from '@models';
import * as services from '@services';
import { ResizedEvent } from 'angular-resize-event';

enum ProcessingQueueTab {
  SCENES = 'Scenes',
  OPTIONS = 'Options'
}

@Component({
  selector: 'app-processing-queue',
  templateUrl: './processing-queue.component.html',
  styleUrls: ['./processing-queue.component.scss']
})
export class ProcessingQueueComponent implements OnInit {
  public allJobs: models.QueuedHyp3Job[] = [];
  public jobs: models.QueuedHyp3Job[] = [];
  public user = '';
  public isUserLoggedIn = false;
  public isUserLoading = true;
  public remaining = 0;
  public areJobsLoading = false;
  public isQueueSubmitProcessing = false;
  public previousQueue: {jobs: any[]; jobTypeId: string} | null = null;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public selectedTab = ProcessingQueueTab.SCENES;
  public Tabs = ProcessingQueueTab;

  public projectName = '';
  public processingOptions: models.Hyp3ProcessingOptions;

  public hyp3JobTypes = models.hyp3JobTypes;
  public hyp3JobTypesList: models.Hyp3JobType[];
  public selectedJobTypeId: string | null = null;
  public jobTypesWithQueued = [];

  public style: object = {};
  public dlWidth = 1000;
  public dlHeight = 1000;
  public dlWidthMin = 715;

  constructor(
    public authService: services.AuthService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
    private snackBar: MatSnackBar,
    private store$: Store<AppState>,
    private hyp3: services.Hyp3Service,
    private screenSize: services.ScreenSizeService,
    private bottomSheet: MatBottomSheet,

  ) { }

  ngOnInit(): void {
    this.store$.dispatch(new hyp3Store.LoadUser());

    this.store$.select(hyp3Store.getIsHyp3UserLoading).subscribe(
      isUserLoading => {
        this.isUserLoading = isUserLoading;
    });

    this.store$.select(queueStore.getQueuedJobs).subscribe((jobs) => {
      const jobTypes: models.Hyp3JobType[] = Object.values(jobs
        .map(job => job.job_type)
        .reduce((types, jobType) => {
          types[jobType.id] = jobType;
          return types;
        }, {}));

      this.hyp3JobTypesList = <any>jobTypes;

      if (!this.selectedJobTypeId) {
        this.selectDefaultJobType();
      }

      this.allJobs = jobs;
      this.jobs = jobs.filter(
        job => job.job_type.id === this.selectedJobTypeId
      );

      this.jobTypesWithQueued = jobTypes.map((jobType) => {
        return {
          jobType: jobType,
          selected: true,
          jobs: this.allJobs.filter(
            job => job.job_type.id === jobType.id
          )
        };
      });
    });

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.user = user.user_id;
        this.remaining = user.quota.remaining;
      }
    );

    this.screenSize.breakpoint$.subscribe(
      breakpoint => this.breakpoint = breakpoint
    );

    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => this.processingOptions = options
    );

    this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
      projectName => this.projectName = projectName
    );

    this.store$.select(userStore.getIsUserLoggedIn).subscribe(
      isLoggedIn => {
        this.isUserLoggedIn = isLoggedIn;
      }
    );
  }

  public onAccountButtonClicked() {
    this.authService.login$().subscribe(
      user => {
        this.store$.dispatch(new userStore.Login(user));
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'account-button-clicked',
          'account-button-clicked': user
        });
      }
    );
  }

  public daysUntilExpiration(expiration_time: moment.Moment): string {
    const current = moment();

    return `${current.diff(expiration_time, 'days')} days`;
  }

  public onReviewQueue() {
    const confirmationRef = this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '500px',
      height: '500px',
      maxWidth: '500px',
      maxHeight: '500px',
      data: this.jobTypesWithQueued
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        this.onSubmitQueue(jobTypesWithQueued);
      }
    );
  }

  public onSubmitQueue(jobTypesWithQueued): void {
    const jobOptionNames = {};
    models.hyp3JobTypesList.forEach(
      jobType => jobOptionNames[jobType.id] = new Set(
        jobType.options.map(option => option.apiName)
      )
    );

    const options = {};
    models.hyp3JobTypesList.forEach(jobType => {
      options[jobType.id] = {};

      Object.entries(this.processingOptions).forEach(([name, value]) => {
        if (jobOptionNames[jobType.id].has(name)) {
          options[jobType.id][name] = value;
        }
      });
    });

    const jobs = jobTypesWithQueued
      .filter(jobType => jobType.selected)
      .map(jobType => jobType.jobs)
      .reduce((acc, val) => acc.concat(val), []);

    const hyp3JobsBatch = jobs.map(job => {
      const jobOptions: any = {
        job_type: job.job_type.id,
        job_parameters: {
          ...options[job.job_type.id],
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
      catchError(resp => {
        if (resp.error) {
          this.snackBar.open(`${resp.error.detail}`, 'Error', {
            duration: 5000,
          });
        }

        return of({jobs: null});
      }),
      tap(_ => this.isQueueSubmitProcessing = false),
    ).subscribe(
      (resp: any) => {
        if (resp.jobs === null) {
          return;
        }

        this.bottomSheet.open(QueueSubmitComponent, {
          data: {numJobs: resp.jobs.length}
        });

        const jobTypes = new Set<string>(jobs.map((job) => job.job_type.id));
        this.selectedJobTypeId = null;
        this.store$.dispatch(new queueStore.ClearProcessingQueueByJobType(jobTypes));

        this.store$.dispatch(new hyp3Store.LoadUser());

        if (this.allJobs.length === 0) {
          this.dialogRef.close();
        }
      }
    );
  }

  public onSetSelectedJobType(jobType: models.Hyp3JobType): void {
    this.selectedJobTypeId = jobType.id;

    this.jobs = this.allJobs.filter(
      job => job.job_type.id === this.selectedJobTypeId
    );
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.store$.dispatch(new queueStore.RemoveJob(job));
  }

  public onClearJobQueue(): void {
    this.previousQueue = { jobTypeId: this.selectedJobTypeId, jobs: this.allJobs };
    this.store$.dispatch(new queueStore.ClearProcessingQueue());
    this.selectedJobTypeId = null;
  }

  public onClearSingleJobQueue(jobType: models.Hyp3JobType): void {

    if (jobType.id === this.selectedJobTypeId) {

      let TabIdx = this.jobTypesWithQueued.findIndex((queuedJobType) => {return queuedJobType.jobType === jobType});

      if(this.jobTypesWithQueued.length > TabIdx + 1) {
        ++TabIdx;
      } else if (TabIdx > 0) {
        --TabIdx;
      } else {
        TabIdx = -1;
      }

      if(TabIdx === -1) {
        this.selectedJobTypeId = null;
      } else {
        this.onSetSelectedJobType(this.jobTypesWithQueued[TabIdx].jobType)
      }
    }

    this.store$.dispatch(new queueStore.ClearProcessingQueueByJobType(new Set<string>([jobType.id])));
    if (this.allJobs.length === 0) {
      this.dialogRef.close();
    }
    
  }

  public onRestoreJobQueue(): void {
    this.selectedJobTypeId = this.previousQueue.jobTypeId;
    this.store$.dispatch(new queueStore.AddJobs(this.previousQueue.jobs));
    this.previousQueue = null;
  }

  public onSelectScenesTab(): void {
    this.selectedTab = ProcessingQueueTab.SCENES;
  }

  public onSelectOptionsTab(): void {
    this.selectedTab = ProcessingQueueTab.OPTIONS;
  }

  public onResized(event: ResizedEvent) {
    this.dlWidth = event.newWidth;
    this.dlHeight = event.newHeight;
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }

  private selectDefaultJobType(): void {
    this.selectedJobTypeId = !!this.hyp3JobTypesList[0] ?
      this.hyp3JobTypesList[0].id : null;
  }
}
