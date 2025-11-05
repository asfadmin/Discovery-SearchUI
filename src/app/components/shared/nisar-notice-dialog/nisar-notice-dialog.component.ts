import { Component } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { interval, Observable, take } from "rxjs";
import { AsyncPipe } from "@angular/common";
@Component({
  selector: "app-nisar-notice-dialog",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, AsyncPipe],
  templateUrl: "./nisar-notice-dialog.component.html",
  styleUrl: "./nisar-notice-dialog.component.scss",
})
export class NisarNoticeDialogComponent {
  public isDisabled = true;
  public totalTime = 5;
  public total$: Observable<number>;
  constructor() {
    const numbers = interval(1000);
    this.total$ = numbers.pipe(take(this.totalTime + 1));
  }
  public closeDialog() {
    localStorage.setItem("nisar-banner", "true");
  }
}
