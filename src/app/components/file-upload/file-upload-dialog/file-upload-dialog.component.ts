import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
