import { Component, OnInit, Input } from '@angular/core';

import { Hyp3Service } from '@services';
import { Hyp3Job } from '@models';

@Component({
  selector: 'app-hyp3-job-status-badge',
  templateUrl: './hyp3-job-status-badge.component.html',
  styleUrls: ['./hyp3-job-status-badge.component.scss']
})
export class Hyp3JobStatusBadgeComponent implements OnInit {
  @Input() job: Hyp3Job;

  constructor(private hyp3: Hyp3Service) { }

  ngOnInit(): void {
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
}
