import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import { Hyp3JobStatusCode } from '@models';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import {} from '@angular/common';

@Component({
  selector: 'app-job-status-selector',
  templateUrl: './job-status-selector.component.html',
  styleUrls: ['./job-status-selector.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,
    MatOption,
    TranslateModule,
  ],
})
export class JobStatusSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public selectedJobStatuses: Hyp3JobStatusCode[] = [];
  public jobStatuses = Object.keys(Hyp3JobStatusCode);
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getJobStatuses).subscribe((selected) => {
        this.selectedJobStatuses = selected;
      }),
    );
  }

  public onNewJobStatusSelected(jobStatuses): void {
    this.store$.dispatch(new filtersStore.SetJobStatuses(jobStatuses));
  }

  public upperCaseFirst = (str: string, forceLower?: boolean): string => {
    if (forceLower) {
      str = str.toLowerCase();
    }
    return str.replace(/^\w/, (chr) => chr.toUpperCase());
  };

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
