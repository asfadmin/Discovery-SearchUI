import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog';

import * as models from '@models';
import { DatapoolAuthService } from '@services';

@Component({
  selector: 'app-granule-detail',
  templateUrl: './granule-detail.component.html',
  styleUrls: ['./granule-detail.component.css']
})
export class GranuleDetailComponent {
  @Input() granule: models.CMRProduct;
  @Output() zoomToGranule = new EventEmitter<models.CMRProduct>();

  constructor(public dialog: MatDialog, public authService: DatapoolAuthService) {}

  public onOpenImage(granule: models.CMRProduct): void {
    this.dialog.open(ImageDialogComponent, {
      height: '95%',
      width: '90%',
      panelClass: 'transparent'
    });
  }

  public onZoomToGranule(): void {
    this.zoomToGranule.emit(this.granule);
  }
}
