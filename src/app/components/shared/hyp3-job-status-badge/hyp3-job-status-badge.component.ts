import { Component, OnInit, input, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatChip } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';

import { ConfirmationComponent } from '@components/header/processing-queue/confirmation/confirmation.component';
import {
  Hyp3Job,
  hyp3JobTypes,
  QueuedHyp3Job,
  Hyp3ProcessingOptions,
} from '@models';
import * as models from '@models';
import { Hyp3ApiService, ScenesService, Hyp3JobStatusService } from '@services';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as queueStore from '@store/queue';

@Component({
  selector: 'app-hyp3-job-status-badge',
  templateUrl: './hyp3-job-status-badge.component.html',
  styleUrls: ['./hyp3-job-status-badge.component.scss'],
  imports: [MatChip, MatMenuTrigger, MatMenu, MatMenuItem, TranslateModule],
})
export class Hyp3JobStatusBadgeComponent implements OnInit {
  private hyp3 = inject(Hyp3ApiService);
  private hyp3JobStatus = inject(Hyp3JobStatusService);
  private scenesService = inject(ScenesService);
  private dialog = inject(MatDialog);
  private store$ = inject<Store<AppState>>(Store);

  public job = input.required<Hyp3Job>();
  private job$ = toObservable(this.job);

  public projectJobs: models.Hyp3Job[] = [];
  public expiredJobs: models.Hyp3Job[] = [];
  public failedJobs: models.Hyp3Job[] = [];

  private costs = this.store$.selectSignal(hyp3Store.getCosts);
  private processingOptions = this.store$.selectSignal(
    hyp3Store.getProcessingOptions,
  );
  private validateOnly = false;
  public remaining = 0;

  ngOnInit(): void {
    this.store$.select(hyp3Store.getHyp3User).subscribe((user) => {
      if (user === null) {
        return;
      }

      this.remaining = user.quota.remaining;
    });

    combineLatest([this.scenesService.scenes$, this.job$]).subscribe(
      ([scenes, selectedJob]) => {
        this.projectJobs = scenes
          .map((scene) => scene.metadata.job)
          .filter((job) => selectedJob.name && selectedJob.name === job.name);

        this.expiredJobs = this.projectJobs.filter((job) =>
          this.isExpired(job),
        );
        this.failedJobs = this.projectJobs.filter((job) => this.isFailed(job));
      },
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

  public onSubmitExpiredJob() {
    const jobType = models.hyp3JobTypes[this.job().job_type as string];

    const job = {
      granules: this.job().scenes,
      job_type: jobType,
      processingOptions: this.job().job_parameters,
    };

    this.openConfirmationDialog(jobType, job);
  }

  public onQueueJobs(jobs: Hyp3Job[]) {
    const job_types = hyp3JobTypes;

    const jobsToQueue = jobs.map((job) => {
      return {
        granules: job.scenes,
        job_type: job_types[job.job_type as string],
      } as QueuedHyp3Job;
    });

    this.store$.dispatch(new queueStore.AddJobs(jobsToQueue));
  }

  private openConfirmationDialog(jobType: models.Hyp3JobType, job) {
    let options: Hyp3ProcessingOptions = this.processingOptions();

    const jobTypeOptions = { ...options[jobType.id] };

    for (const [optionName, optionVal] of Object.entries(
      job.processingOptions,
    )) {
      if (optionName in this.processingOptions()[jobType.id]) {
        jobTypeOptions[optionName] = optionVal;
      }
    }

    options = {
      ...options,
      [jobType.id]: jobTypeOptions,
    };

    const costPerJob = this.hyp3.calculateCredits(
      options[jobType.id],
      this.costs()[jobType.id],
    );

    const jobTypesWithQueued = [
      {
        jobType: jobType,
        selected: true,
        jobs: [job],
        creditTotal: costPerJob,
      },
    ];

    this.dialog.open(ConfirmationComponent, {
      id: 'ConfirmProcess',
      width: '350px',
      height: '500px',
      maxWidth: '350px',
      maxHeight: '500px',
      data: {
        jobTypesWithQueued: jobTypesWithQueued,
        processingOptions: options,
        validateOnly: this.validateOnly,
      },
    });
  }
}
