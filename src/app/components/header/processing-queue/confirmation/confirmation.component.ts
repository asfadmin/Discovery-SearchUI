import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  public jobTypesWithQueued = [];

  constructor(
    public dialogRef: MatDialogRef<ConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    this.jobTypesWithQueued = this.data;
  }

  public onToggleJobType(tabQueue): void {
    this.jobTypesWithQueued = this.jobTypesWithQueued.map(
      tab => {
        if (tab.jobType.id === tabQueue.jobType.id) {
          return {
            jobType: tab.jobType,
            selected: !tab.selected,
            jobs: tab.jobs,
            creditTotal: tab.creditTotal,
          };
        } else {
          return tab;
        }
      }
    );
  }

  public amountSelected(jobTypes): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map(jobType => jobType.jobs.length)
      .reduce((a, b) => a + b, 0);
  }

  public creditsSelected(jobTypes): number {
    return jobTypes
      .filter((jobType) => jobType.selected)
      .map(jobType => jobType.creditTotal)
      .reduce((a, b) => a + b, 0);
  }

  public onCancelQueue(): void {
    this.dialogRef.close();
  }

  public onSubmitQueue(): void {
    this.dialogRef.close(this.jobTypesWithQueued);
  }
}
