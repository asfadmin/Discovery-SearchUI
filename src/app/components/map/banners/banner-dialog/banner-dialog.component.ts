import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { DialogData } from '@components/map/banners';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-banner-dialog',
  templateUrl: './banner-dialog.component.html',
  styleUrls: ['./banner-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BannerDialogComponent implements OnInit {
  data = inject<DialogData>(MAT_DIALOG_DATA);

  htmlContent: string;

  ngOnInit(): void {
  }
}
