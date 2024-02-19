import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationComponent } from './confirmation/confirmation.component';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import moment from 'moment';
import { of, from } from 'rxjs';
import { tap, catchError, delay, concatMap, finalize } from 'rxjs/operators';

import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';
import * as uiStore from '@store/ui';
import * as models from '@models';
import * as services from '@services';

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
  @ViewChild('contentArea') contentAreaRef: ElementRef;
  @ViewChild('contentTopArea') topRef: ElementRef;
  @ViewChild('contentBottomArea') bottomRef: ElementRef;
  @ViewChild('errorHeader') errorHeaderRef: ElementRef;

  public allJobs: models.QueuedHyp3Job[] = [];
  public jobs: models.QueuedHyp3Job[] = [];
  public user = '';
  public isUserLoggedIn = false;
  public isUserLoading = true;
  public remaining = 0;
  public isUnlimitedUser = false;
  public areJobsLoading = false;
  public isQueueSubmitProcessing = false;
  public isTabMenuOpen = false;
  public previousQueue: {jobs: any[]; jobTypeId: string} | null = null;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public selectedTab = ProcessingQueueTab.SCENES;
  public Tabs = ProcessingQueueTab;

  public projectName = '';
  public processingOptions: models.Hyp3ProcessingOptions;
  public validateOnly = false;

  public hyp3JobTypes = models.hyp3JobTypes;
  public hyp3JobTypesList: models.Hyp3JobType[];
  public selectedJobTypeId: string | null = null;
  public jobTypesWithQueued = [];

  public contentAreaHeight = 0;
  public contentTopAreaHeight = 0;
  public contentBottomAreaHeight = 0;
  public errorHeaderHeight = 0;
  public progress = null;

  constructor(
    public authService: services.AuthService,
    public env: services.EnvironmentService,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
    private store$: Store<AppState>,
    private hyp3: services.Hyp3Service,
    private screenSize: services.ScreenSizeService,
    private notificationService: services.NotificationService,
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
        this.isUnlimitedUser = user.quota.unlimited;
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
        this.updateContentBottomHeight();
      }
    );

    if (!this.isUserLoggedIn && !this.isUserLoading) {
      if (!this.errorHeaderRef === undefined) {
        this.errorHeaderHeight = this.errorHeaderRef.nativeElement.offsetHeight;
      } else {
        this.errorHeaderHeight = 0;
      }
    }
    this.updateContentBottomHeight();
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
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: this.jobTypesWithQueued
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        if (this.env.maturity === 'prod') {
          this.validateOnly = false;
        }

        this.onSubmitQueue(
          jobTypesWithQueued,
          this.validateOnly
        );
      }
    );
  }

  public mockHTTPRequest(url) {
    return of(`Response from ${url}`).pipe(
      delay(1000)
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

  public onSubmitQueue(jobTypesWithQueued, validateOnly: boolean): void {
    const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions: this.processingOptions
    });

    const batchSize = 20;
    const hyp3JobRequestBatches = this.chunk(hyp3JobsBatch, batchSize);
    const total = hyp3JobRequestBatches.length;
    let current = 0;

    this.isQueueSubmitProcessing = true;

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
        this.progress = Math.floor((current / total) * 100);
      }),
      finalize(() => {
        this.progress = null;
        this.isQueueSubmitProcessing = false;

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
    this.store$.dispatch(new hyp3Store.ClearProcessingOptions());
    this.selectedJobTypeId = null;
  }

  public onClearSingleJobQueue(jobType: models.Hyp3JobType): void {
    if (jobType.id === this.selectedJobTypeId) {
      this.setNextTabIndex(jobType);
    }

    this.store$.dispatch(new queueStore.ClearProcessingQueueByJobType(new Set<string>([jobType.id])));

    if (this.allJobs.length === 0) {
      this.dialogRef.close();
      this.store$.dispatch(new hyp3Store.ClearProcessingOptions());
    }
  }

  public setNextTabIndex(jobType: models.Hyp3JobType) {
    let TabIdx = this.jobTypesWithQueued.findIndex(
      (queuedJobType) => queuedJobType.jobType === jobType
    );

    if (this.jobTypesWithQueued.length > TabIdx + 1) {
      ++TabIdx;
    } else if (TabIdx > 0) {
      --TabIdx;
    } else {
      TabIdx = -1;
    }

    if (TabIdx === -1) {
      this.selectedJobTypeId = null;
    } else {
      this.onSetSelectedJobType(this.jobTypesWithQueued[TabIdx].jobType);
    }
  }

  public getTabIdIndex(id: string) {
    return this.jobTypesWithQueued.findIndex((queuedJobType) => queuedJobType.jobType.id === id);
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

  public onResized() {
    this.updateContentBottomHeight();
  }

  public updateContentBottomHeight() {
    if (this.contentAreaRef !== undefined && this.topRef !== undefined) {
      this.contentAreaHeight = this.contentAreaRef.nativeElement.offsetHeight;
      this.contentTopAreaHeight = this.topRef.nativeElement.offsetHeight;
      this.contentBottomAreaHeight = this.contentAreaHeight - this.contentTopAreaHeight - this.errorHeaderHeight;
    }
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }

  public onCloseTabMenu() {
    this.isTabMenuOpen = false;
  }


  public onOpenTabMenu() {
    this.isTabMenuOpen = true;
  }

  public onOpenPreferences(): void {
    this.store$.dispatch(new uiStore.OpenPreferenceMenu());
  }

  public onValidateOnlyToggle(val: boolean): void {
    this.validateOnly = val;
  }

  private selectDefaultJobType(): void {
    this.selectedJobTypeId = !!this.hyp3JobTypesList[0] ?
      this.hyp3JobTypesList[0].id : null;
  }
}
