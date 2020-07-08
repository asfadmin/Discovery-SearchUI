import { Component, OnInit } from '@angular/core';

import { Hyp3Service } from '@services';

@Component({
  selector: 'app-hyp3-jobs-dialog',
  templateUrl: './hyp3-jobs-dialog.component.html',
  styleUrls: ['./hyp3-jobs-dialog.component.scss']
})
export class Hyp3JobsDialogComponent implements OnInit {
  public jobs$ = this.hyp3.getJobs$();

  constructor(private hyp3: Hyp3Service) { }

  ngOnInit(): void {
  }
}
