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
  public costs: models.Hyp3CostsByJobType;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store$.select(queueStore.getQueuedJobs).subscribe(
      jobs => {
        this.jobs = jobs
      }
    );

    this.store$.select(hyp3Store.getProcessingOptions).subscribe(
      options => {
        this.optionValues = options;
      }
    );

    this.store$.select(hyp3Store.getCosts).subscribe(
      costs => {
        this.costs = costs;
      }
    );
  }

  public hasJobType(jobType: models.Hyp3JobType): boolean {
    return this.jobs.some(
      job => job.job_type.id === jobType.id
    );
  }

  public onSetOptionValue(apiName: string, value: any) {
    const newOptions = {
      ...this.optionValues[this.selectedJobType.id],
      [apiName]: value
    };

    this.store$.dispatch(new hyp3Store.SetProcessingOptions({
      jobTypeId: this.selectedJobType.id,
      options: newOptions
    }));
  }

  public onSetSubset(options): void {
    const optionSubset = options.reduce((subset, option) => {
      subset[option.apiName] = option.value;

      return subset;
    }, {});

    const newOptions = {
      ...this.optionValues[this.selectedJobType.id],
      ...optionSubset
    }

    this.store$.dispatch(new hyp3Store.SetProcessingOptions({
      jobTypeId: this.selectedJobType.id,
      options: newOptions
    }));
  }

  public getCostTable(costs, jobType, option) {

    const jobTypeCost = costs[jobType.id];

    if (jobTypeCost.cost_table && option.apiName === jobTypeCost.cost_parameter) {
      return jobTypeCost.cost_table;
    } else {
      return null;
    }
  }
}
