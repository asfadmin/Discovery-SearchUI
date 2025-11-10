import { Component, OnInit, Input, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as queueStore from '@store/queue';

import * as models from '@models';
import { DropdownOptionComponent } from './dropdown-option/dropdown-option.component';
import { RangeOptionComponent } from './range-option/range-option.component';
import { CheckboxOptionComponent } from './checkbox-option/checkbox-option.component';
import { SubsetOptionComponent } from './subset-option/subset-option.component';
import { UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-processing-options',
  templateUrl: './processing-options.component.html',
  styleUrls: ['./processing-options.component.scss'],
  imports: [
    DropdownOptionComponent,
    RangeOptionComponent,
    CheckboxOptionComponent,
    SubsetOptionComponent,
    UpperCasePipe,
    TranslateModule,
  ],
})
export class ProcessingOptionsComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);

  @Input() selectedJobType: models.Hyp3JobType;

  public jobs: models.QueuedHyp3Job[];
  public JobTypesList = models.hyp3JobTypesList;

  public optionValues = {};
  public costs: models.Hyp3Costs;

  ngOnInit() {
    this.store$.select(queueStore.getQueuedJobs).subscribe((jobs) => {
      this.jobs = jobs;
    });

    this.store$.select(hyp3Store.getProcessingOptions).subscribe((options) => {
      this.optionValues = options;
    });

    this.store$.select(hyp3Store.getCosts).subscribe((costs) => {
      this.costs = costs;
    });
  }

  public hasJobType(jobType: models.Hyp3JobType): boolean {
    return this.jobs.some((job) => job.job_type.id === jobType.id);
  }

  public onSetOptionValue(apiName: string, value: any) {
    const newOptions = {
      ...this.optionValues[this.selectedJobType.id],
      [apiName]: value,
    };

    this.store$.dispatch(
      new hyp3Store.SetProcessingOptions({
        jobTypeId: this.selectedJobType.id,
        options: newOptions,
      }),
    );
  }

  public onSetSubset(options): void {
    const optionSubset = options.reduce((subset, option) => {
      subset[option.apiName] = option.value;

      return subset;
    }, {});

    const newOptions = {
      ...this.optionValues[this.selectedJobType.id],
      ...optionSubset,
    };

    this.store$.dispatch(
      new hyp3Store.SetProcessingOptions({
        jobTypeId: this.selectedJobType.id,
        options: newOptions,
      }),
    );
  }

  public getCostTable(costs, jobType, option) {
    const jobTypeCost = costs[jobType.id];

    if (
      jobTypeCost.cost_parameters &&
      jobTypeCost.cost_parameters.includes(option.apiName)
    ) {
      return jobTypeCost.cost_table;
    } else {
      return null;
    }
  }
}
