import { Component } from '@angular/core';

import { MatDialogRef } from '@angular/material';

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
