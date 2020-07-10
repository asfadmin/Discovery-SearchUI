import { Component, OnInit } from '@angular/core';

import { Hyp3Service } from '@services';

@Component({
  selector: 'app-hyp3-jobs-dialog',
  templateUrl: './hyp3-jobs-dialog.component.html',
  styleUrls: ['./hyp3-jobs-dialog.component.scss']
})
export class Hyp3JobsDialogComponent implements OnInit {
  public jobs = [];

  constructor(private hyp3: Hyp3Service) { }

  ngOnInit(): void {
    this.hyp3.getJobs$().subscribe((resp: any) => {
      this.jobs = resp.jobs.map(job => job.files[0]);
    });
  }

  public onCloseDialog() {

  }
}
