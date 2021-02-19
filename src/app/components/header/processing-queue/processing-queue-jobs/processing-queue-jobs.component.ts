import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';
import * as hyp3Store from '@store/hyp3';
import {Store} from '@ngrx/store';
import {AppState} from '@store';

@Component({
  selector: 'app-processing-queue-jobs',
  templateUrl: './processing-queue-jobs.component.html',
  styleUrls: ['./processing-queue-jobs.component.scss']
})
export class ProcessingQueueJobsComponent implements OnInit {
  @Input() jobs: models.QueuedHyp3Job[];
  @Input() areJobsLoading: boolean;

  @Output() removeJob = new EventEmitter<models.QueuedHyp3Job>();

  public projectName = '';

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
  }

  public onProjectNameChange(projectName: string): void {
    this.store$.dispatch(new hyp3Store.SetProcessingProjectName(projectName));
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.removeJob.emit(job);
  }

}
