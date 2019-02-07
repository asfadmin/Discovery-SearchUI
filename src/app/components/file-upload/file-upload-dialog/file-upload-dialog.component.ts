import { Component, ViewChild } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { forkJoin, Subscription } from 'rxjs';

import { AsfApiService } from '@services';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent {
  @ViewChild('file') file;

  public files: Set<File> = new Set();
  public request: Subscription;
  public canBeClosed = true;
  public primaryButtonText = 'Upload';
  public showCancelButton = true;
  public uploading = false;
  public uploadSuccessful = false;

  constructor(
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    private asfApiService: AsfApiService,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;

    console.log(files);
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.files.add(files[key]);
      }
    }
  }

  onUpload() {
    this.uploading = true;

    this.request = this.asfApiService.upload(this.files).subscribe(resp => {
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;

      this.uploadSuccessful = true;

      this.uploading = false;

      return this.dialogRef.close(resp.wkt);
    });

    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    this.showCancelButton = false;
  }
}
