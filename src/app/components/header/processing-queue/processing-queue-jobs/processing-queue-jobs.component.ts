import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-processing-queue-jobs',
  templateUrl: './processing-queue-jobs.component.html',
  styleUrls: ['./processing-queue-jobs.component.scss']
})
export class ProcessingQueueJobsComponent implements OnInit {
  @Input() jobs: models.QueuedHyp3Job[];
  @Input() areJobsLoading: boolean;

  @Output() removeJob = new EventEmitter<models.QueuedHyp3Job>();

  constructor() { }

  ngOnInit(): void {
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.removeJob.emit(job);
  }

}
