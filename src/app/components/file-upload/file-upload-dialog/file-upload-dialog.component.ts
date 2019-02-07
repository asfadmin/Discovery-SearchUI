import { Component, ViewChild, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';

import { MatDialogRef } from '@angular/material';
import { forkJoin, Subscription } from 'rxjs';

import { AsfApiService } from '@services';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit, OnDestroy {
  @ViewChild('file') file;

  public dropEvent: any;
  public files: Set<File> = new Set();
  public request: Subscription;
  public canBeClosed = true;
  public primaryButtonText = 'Upload';
  public showCancelButton = true;
  public uploading = false;
  public uploadSuccessful = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    private asfApiService: AsfApiService,
  ) {}

  public ngOnInit() {
    this.dropEvent = this.renderer.listen(this.elementRef.nativeElement, 'drop', (ev) => {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            const file = ev.dataTransfer.items[i].getAsFile();
            this.files.add(file);
          }
        }
      } else {
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
          const file = ev.dataTransfer.files[i];
          this.files.add(file);
        }
      }

      ev.preventDefault();
    });
  }

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

  public drop(ev) {
    console.log('from dialog', ev);
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        if (ev.dataTransfer.items[i].kind === 'file') {
          const file = ev.dataTransfer.items[i].getAsFile();
          console.log(file);
        }
      }
    } else {
      for (let i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
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

  public ngOnDestroy(): void {
    this.dropEvent();
  }
}
