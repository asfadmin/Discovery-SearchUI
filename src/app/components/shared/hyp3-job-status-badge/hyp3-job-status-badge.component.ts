import { Component, OnInit, Input } from '@angular/core';

import { EnvironmentService, Hyp3Service, NotificationService, ScenesService } from '@services';
import { Hyp3Job, hyp3JobTypes, QueuedHyp3Job } from '@models';
import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

import * as hyp3Store from '@store/hyp3';
import { catchError, finalize, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-hyp3-job-status-badge',
  templateUrl: './hyp3-job-status-badge.component.html',
  styleUrls: ['./hyp3-job-status-badge.component.scss']
})
export class Hyp3JobStatusBadgeComponent implements OnInit {
  @Input() job: Hyp3Job;
  @Input() isFileDetails = true;

  private jobs;
  private projectName = '';
  private validateOnly = false;
  public remaining = 0;

  constructor(
    private hyp3: Hyp3Service,
    private scenesService: ScenesService,
    private dialog: MatDialog,
    private env: EnvironmentService,
    private store$: Store<AppState>,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
      projectName => this.projectName = projectName
    );

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.remaining = user.quota.remaining;
      }
    );

    this.scenesService.scenes$.subscribe(
      scenes => {
        this.jobs = scenes.map(scene => scene.metadata.job);
      }
    );
  }

  public isExpired(job: Hyp3Job): boolean {
    return this.hyp3.isExpired(job);
  }

  public isFailed(job: Hyp3Job): boolean {
    return this.hyp3.isFailed(job);
  }

  public isPending(job: Hyp3Job): boolean {
    return this.hyp3.isPending(job);
  }

  public isRunning(job: Hyp3Job): boolean {
    return this.hyp3.isRunning(job);
  }

  private openConfirmationDialog(jobType, jobs) {
    const confirmationRef = this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: [{
        jobType,
        selected: true,
        jobs,
        creditTotal: 10
      }]
    });

    confirmationRef.afterClosed().subscribe(
      jobTypesWithQueued => {
        if (!jobTypesWithQueued) {
          return;
        }

        if (this.env.maturity === 'prod') {
          this.validateOnly = false;
        }

        this.onResubmitExpiredJob(
          jobTypesWithQueued,
          this.validateOnly
        );
      }
    );
  }

  public onReviewExpiredJobs() {
    const job_types = hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      this.job.job_type === id as any);
    const jobType = job_types[job_type];

    const projectJobs = this.jobs
      .filter(job => job.name === this.job.name && this.isExpired(job) && !this.isFailed(job))
      .map(job => ({
          granules: job.job_parameters.scenes,
          job_type: jobType
        } as QueuedHyp3Job
    ));

    this.openConfirmationDialog(
      jobType, projectJobs
    );
  }

  public onReviewExpiredJob() {
    const job_types = hyp3JobTypes;
    const job_type = Object.keys(job_types).find(id =>
      this.job.job_type === id as any);
    const jobType = job_types[job_type];

    const job = [{
        granules: this.job.job_parameters.scenes,
        job_type: jobType
      } as QueuedHyp3Job];

    this.openConfirmationDialog(
      jobType, job
    );
  }

  public onResubmitExpiredJob(jobTypesWithQueued, validateOnly: boolean) {
    const processOptionKeys = Object.keys(this.job.job_parameters).filter(
      key => key !== 'granules'
    );
    const processingOptions = {};

    processOptionKeys.forEach(
      key => processingOptions[key] = this.job.job_parameters[key]
    );

    const hyp3JobsBatch = this.hyp3.formatJobs(jobTypesWithQueued, {
      projectName: this.projectName,
      processingOptions
    });

    this.hyp3.submitJobBatch$({jobs: hyp3JobsBatch, validate_only: validateOnly}).pipe(
      catchError(resp => {
        if (resp.error) {
          if (resp.error.detail === 'No authorization token provided' || resp.error.detail === 'Provided apikey is not valid') {
            this.notificationService.error('Your authorization has expired. Please sign in again.', 'Error', {
              timeOut: 5000,
          });
          } else {
            this.notificationService.error( resp.error.detail, 'Error', {
              timeOut: 5000,
            });
          }
        }

        return of({jobs: null});
      }),
      finalize(() => {
        this.store$.dispatch(new hyp3Store.LoadUser());

        let jobText;
        const submittedJobs = Math.abs(hyp3JobsBatch.length);
        jobText = submittedJobs > 1 ? `${submittedJobs} Jobs` : 'Job';
        if (jobText) {
          this.notificationService.info(`${submittedJobs} expired ${jobText} submitted for re-processing.`,
          `Expired ${jobText} Submitted`,
          {
            closeButton: true,
            disableTimeOut: true,
          });
        }
      }),
      first(),
    ).subscribe();
  }
}
