import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material';
import { ImageDialogComponent } from './image-dialog';

import * as models from '@models';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.css']
})
export class GranuleDetailComponent {
  @Input() granule: models.CMRProduct;

  constructor(public dialog: MatDialog) {}

  public onOpenImage(granule): void {
    this.dialog.open(ImageDialogComponent, {
      height: '95%',
      width: 'auto',
      panelClass: 'transparent'
    });
  }
}
