import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfirmationComponent } from './confirmation/confirmation.component';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import moment from 'moment';
import { of, combineLatest } from 'rxjs';
import { delay } from 'rxjs/operators';

import * as queueStore from '@store/queue';
import * as hyp3Store from '@store/hyp3';
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
  public jobTypesWithQueued: models.JobTypesWithQueued[] = [];
  public costPerJobByType = {};
  public totalCreditCost = 0;

  public contentAreaHeight = 0;
  public contentTopAreaHeight = 0;
  public contentBottomAreaHeight = 0;
  public errorHeaderHeight = 0;
  public progress = null;

  constructor(
    public authService: services.AuthService,
    public env: services.EnvironmentService,
    public dialog: MatDialog,
    public hyp3: services.Hyp3Service,
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
    private store$: Store<AppState>,
    private screenSize: services.ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(new hyp3Store.LoadUser());

    this.store$.select(hyp3Store.getIsHyp3UserLoading).subscribe(
      isUserLoading => {
        this.isUserLoading = isUserLoading;
    });

    combineLatest(
      this.store$.select(queueStore.getQueuedJobs),
      this.store$.select(hyp3Store.getCosts),
      this.store$.select(hyp3Store.getProcessingOptions),
    )
    .subscribe(([jobs, costs, options]) => {
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

      this.processingOptions = options;

      this.jobTypesWithQueued = jobTypes.map((jobType) => {

        const costPerJob = this.hyp3.calculateCredits(options[jobType.id], costs[jobType.id]);
        this.costPerJobByType[jobType.id] = costPerJob;

        const jobsFiltered = this.allJobs.filter(
          job => job.job_type.id === jobType.id
        );

        return {
          jobType: jobType,
          selected: true,
          jobs: jobsFiltered,
          creditTotal: costPerJob * jobsFiltered.length
        };
      });

        this.totalCreditCost = this.jobTypesWithQueued.reduce((total, jobType) => {
          total += jobType.creditTotal;
          return total;
        }, 0)
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
    console.log(this.processingOptions);

    const confirmationRef = this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '600px',
      maxWidth: '350px',
      maxHeight: '600px',
      data: {
        jobTypesWithQueued: this.jobTypesWithQueued,
        projectName: this.projectName,
        processingOptions: this.processingOptions,
        validateOnly: this.validateOnly,
      }
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        if (this.env.maturity === 'prod') {
          this.validateOnly = false;
        }

        this.onSubmitQueue();
      }
    );
  }

  public mockHTTPRequest(url) {
    return of(`Response from ${url}`).pipe(
      delay(1000)
    );
  }

  public onSubmitQueue(): void {
    if(this.allJobs.length === 0) {
      this.dialogRef.close();
    }

    const jobsInTab = this.allJobs.filter(
      job => job.job_type.id === this.selectedJobTypeId
    );

    if (jobsInTab.length === 0) {
      this.setNextTabIndex(models.hyp3JobTypes[this.selectedJobTypeId]);
    }
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
