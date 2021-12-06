import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as queueStore from '@store/queue';

import * as models from '@models';

@Component({
  selector: 'app-processing-options',
  templateUrl: './processing-options.component.html',
  styleUrls: ['./processing-options.component.scss']
})
export class ProcessingOptionsComponent implements OnInit {
  @Input() selectedJobType: models.Hyp3JobType;

  public jobs: models.QueuedHyp3Job[];
  public JobTypesList = models.hyp3JobTypesList;

  public optionValues = {};

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(queueStore.getQueuedJobs).subscribe(
      jobs => this.jobs = jobs
    );

    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => {
        this.optionValues = options;
      }
    );
  }
  public hasJobType(jobType: models.Hyp3JobType): boolean {
    return this.jobs.some(
      job => job.job_type.id === jobType.id
    );
  }

  public onSetOptionValue(apiName: string, value: any) {
    this.optionValues = {
      ...this.optionValues,
      [apiName]: value
    };

    this.store$.dispatch(new hyp3Store.SetProcessingOptions({
      ...this.optionValues
    }));
  }

  public onSetSubset(options): void {
    options.forEach(option => {
      this.optionValues = {
        ...this.optionValues,
        [option.apiName]: option.value
      };
    });

    this.store$.dispatch(new hyp3Store.SetProcessingOptions({
      ...this.optionValues
    }));
  }
}
