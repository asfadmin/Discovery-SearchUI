import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedModule } from '@shared';

@Component({
  selector: 'app-disp-disclaimer-dialog',
  template: `
    <h2 mat-dialog-title class="disp-disclaimer-title">
      {{ 'DISPLACEMENT_DATA_DISCLAIMER' | translate }}
    </h2>
    <mat-dialog-content>
      <p>{{ 'DISPLACEMENT_DATA_DISCLAIMER_TEXT' | translate }}</p>
    </mat-dialog-content>

    <mat-dialog-actions style="justify-content: flex-end">
      <button mat-button mat-dialog-close tabindex="-1">Close</button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./timeseries-results-menu.component.scss'],
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    SharedModule,
  ],
})
export class DispDataDisclaimerComponent {
  dialogRef = inject<MatDialogRef<DispDataDisclaimerComponent>>(MatDialogRef);
}
