import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { DialogData } from '@components/map/banners';

@Component({
  selector: 'app-banner-dialog',
  templateUrl: './banner-dialog.component.html',
  styleUrls: ['./banner-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TranslateModule,
  ],
})
export class BannerDialogComponent {
  data = inject<DialogData>(MAT_DIALOG_DATA);

  htmlContent: string;
}
