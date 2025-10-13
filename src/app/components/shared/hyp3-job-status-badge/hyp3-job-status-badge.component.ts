import { Component, OnInit, Input, inject } from '@angular/core';

import { Hyp3ApiService, ScenesService, Hyp3JobStatusService } from '@services';
import { Hyp3Job, hyp3JobTypes, QueuedHyp3Job, Hyp3ProcessingOptions } from '@models';
import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

import * as models from '@models';
import * as hyp3Store from '@store/hyp3';
import * as queueStore from '@store/queue';

@Component({
  selector: 'app-hyp3-job-status-badge',
  templateUrl: './hyp3-job-status-badge.component.html',
  styleUrls: ['./hyp3-job-status-badge.component.scss']
})
export class Hyp3JobStatusBadgeComponent implements OnInit {
  private hyp3 = inject(Hyp3ApiService);
  private hyp3JobStatus = inject(Hyp3JobStatusService);
  private scenesService = inject(ScenesService);
  private dialog = inject(MatDialog);
  private store$ = inject<Store<AppState>>(Store);

  @Input() job: Hyp3Job;
  @Input() isFileDetails = true;

  private jobs: models.Hyp3Job[];
  private costs: models.Hyp3Costs;
  private processingOptions: Hyp3ProcessingOptions;
  private projectName = '';
  private validateOnly = false;
  public remaining = 0;

  ngOnInit(): void {
    this.store$.select(hyp3Store.getProcessingProjectName).subscribe(
      projectName => this.projectName = projectName
    );

    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => this.processingOptions = options
    );

    this.store$.select(hyp3Store.getCosts).subscribe(
      costs => this.costs = costs
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
    return this.hyp3JobStatus.isExpired(job);
  }

  public isFailed(job: Hyp3Job): boolean {
    return this.hyp3JobStatus.isFailed(job);
  }

  public isPending(job: Hyp3Job): boolean {
    return this.hyp3JobStatus.isPending(job);
  }

  public isRunning(job: Hyp3Job): boolean {
    return this.hyp3JobStatus.isRunning(job);
  }

  public onReviewExpiredJob() {
    const jobType = models.hyp3JobTypes[(this.job.job_type as string)];

    const job = {
      granules: this.job.scenes,
      job_type: jobType,
      processingOptions: this.job.job_parameters
    };

    this.openConfirmationDialog(
      jobType, job
    );
  }

  public onReviewExpiredJobs() {
    const job_types = hyp3JobTypes;

    const projectJobs = this.jobs
      .filter(job => job.name === this.job.name && this.isExpired(job) && !this.isFailed(job))
      .map(job => {
        return ({
          granules: job.scenes,
          job_type: job_types[(job.job_type as string)],
        } as QueuedHyp3Job);
      });

    this.store$.dispatch(new queueStore.AddJobs(projectJobs));
  }

  private openConfirmationDialog(jobType: models.Hyp3JobType, job) {
    let options: Hyp3ProcessingOptions = this.processingOptions;

    const jobTypeOptions = { ...options[jobType.id] };

    for (const [optionName, optionVal] of Object.entries(job.processingOptions)) {
      if (optionName in this.processingOptions[jobType.id]) {
        jobTypeOptions[optionName] = optionVal;
      }
    }

    options = {
      ...options,
      [jobType.id]: jobTypeOptions
    };

    const costPerJob = this.hyp3.calculateCredits(options[jobType.id], this.costs[jobType.id]);

    const jobTypesWithQueued = [{
      jobType: jobType,
      selected: true,
      jobs: [job],
      creditTotal: costPerJob
    }];

    this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: {
        jobTypesWithQueued: jobTypesWithQueued,
        projectName: this.projectName,
        processingOptions: options,
        validateOnly: this.validateOnly,
      }
    });
  }
}
