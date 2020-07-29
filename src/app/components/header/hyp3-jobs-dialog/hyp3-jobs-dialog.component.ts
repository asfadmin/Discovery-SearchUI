import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from '@store';

import { Hyp3Service } from '@services';
import * as hyp3Store from '@store/hyp3';
import * as models from '@models';

@Component({
  selector: 'app-hyp3-jobs-dialog',
  templateUrl: './hyp3-jobs-dialog.component.html',
  styleUrls: ['./hyp3-jobs-dialog.component.scss']
})
export class Hyp3JobsDialogComponent implements OnInit {
  public jobs = [];
  public user = '';
  public remaining = 0;
  public limit = 0;
  public areJobsLoading = false;

  constructor(
    private dialogRef: MatDialogRef<Hyp3JobsDialogComponent>,
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.store$.select(hyp3Store.getAreHyp3JobsLoading).subscribe(
      areLoading => this.areJobsLoading = areLoading
    );
    this.store$.select(hyp3Store.getHyp3Jobs).subscribe(jobs => {
      this.jobs = jobs
        .filter(job => job.status_code === models.Hyp3JobStatusCode.SUCCEEDED)
        .map(job => job.files[0]);
    });

    this.store$.select(hyp3Store.getHyp3User).subscribe(
      user => {
        if (user === null) {
          return;
        }

        this.user = user.user_id;
        this.remaining = user.quota.remaining;
        this.limit = user.quota.limit;
      }
    );
  }

  public onCloseDialog() {
    this.dialogRef.close();
  }
}
