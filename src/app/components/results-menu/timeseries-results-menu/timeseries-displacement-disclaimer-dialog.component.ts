import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-disp-disclaimer-dialog',
  template: `
    <h2 mat-dialog-title class="disp-disclaimer-title">
      {{ 'DISPLACEMENT_DATA_DISCLAIMER' | translate }}
    </h2>
    <mat-dialog-content>
      <p>
        {{ 'DISPLACEMENT_DATA_DISCLAIMER_TEXT' | translate }}
      </p>
    </mat-dialog-content>

    <mat-dialog-actions style="justify-content: flex-end">
      <button mat-button mat-dialog-close tabindex="-1">
        <app-docs-modal
          class="info-icon"
          text="{{ FAQText }}"
          url="https://docs.asf.alaska.edu/datasets/disp_faq/"
        ></app-docs-modal>
      </button>
      <button mat-button mat-dialog-close tabindex="-1">
        {{ 'CLOSE' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styleUrls: ['./timeseries-results-menu.component.scss'],
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose,
    DocsModalComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class DispDataDisclaimerComponent implements OnInit, OnDestroy {
  dialogRef = inject<MatDialogRef<DispDataDisclaimerComponent>>(MatDialogRef);
  translate = inject(TranslateService);
  subs = new SubSink();

  public FAQText = 'OPEN_FAQ';

  ngOnInit(): void {
    this.subs.add(
      this.translate
        .get('OPEN_FAQ')
        .subscribe((translatedText) => (this.FAQText = translatedText)),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
