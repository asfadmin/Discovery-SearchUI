import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material';

import { MapInteractionModeType } from '@models';
import { FileUploadDialogComponent } from './file-upload-dialog';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() interaction$: Observable<MapInteractionModeType>;

  @Output() dialogClose = new EventEmitter<void>();
  @Output() newSearchPolygon = new EventEmitter<string>();

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.interaction$.pipe(
      filter(interaction => interaction === MapInteractionModeType.UPLOAD)
    ).subscribe(_ => this.openDialog());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent , {
      width: '50%', height: '50%'
    });

    dialogRef.afterClosed().subscribe(
      wkt => {
        if (wkt) {
          this.newSearchPolygon.emit(wkt);
        }
        this.dialogClose.emit();
      }
    );
  }
}

