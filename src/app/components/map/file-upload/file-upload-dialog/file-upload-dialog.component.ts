import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, Subscription, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { AsfApiService } from '@services';

enum FileErrors {
  TOO_LARGE = 'Too large',
  INVALID_TYPE = 'Invalid Type'
}

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit, OnDestroy {
  @ViewChild('file', { static: true }) file;

  public files: Set<File> = new Set();
  public request: Subscription;
  public canBeClosed = true;
  public showCancelButton = true;
  public uploading = false;

  public fileError$ = new Subject<FileErrors>();
  public isFileError = false;
  private subs = new SubSink();

  constructor(
    private dialogRef: MatDialogRef<FileUploadDialogComponent>,
    private snackBar: MatSnackBar,
    private asfApiService: AsfApiService,
  ) {}

  public ngOnInit(): void {
    this.subs.add(
      this.fileError$.pipe(
        tap(_ => this.isFileError = true),
        tap(
          error => {
            if (error === FileErrors.INVALID_TYPE) {
              this.snackBar.open( `Invalid File Type`, 'FILE ERROR', { duration: 5000 });
            } else if (error === FileErrors.TOO_LARGE) {
              this.snackBar.open( `File is too large (over 10MB)`, 'FILE ERROR', { duration: 5000 });
            }
          }
        ),
        delay(820),
        tap(_ => this.isFileError = false),
      ).subscribe(
        _ => _
      )
    );
  }

  public onFileDrop(ev): void {
    if (ev.dataTransfer.items) {
      for (const item of ev.dataTransfer.items) {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          this.addFile(file);
        }
      }
    } else {
      for (const file of ev.dataTransfer.files) {
        this.addFile(file);
      }
    }

    ev.preventDefault();
  }

  public addFiles(): void {
    this.file.nativeElement.click();
  }

  public areNoFiles(files: Set<File>): boolean {
    return files.size === 0;
  }

  public onFilesAdded(): void {
    const files: { [key: string]: File } = this.file.nativeElement.files;

    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.addFile(files[key]);
      }
    }
  }

  public onRemoveFile(file): void {
    this.files.delete(file);
  }

  public onUpload(): void {
    this.uploading = true;

    this.subs.add(
      this.request = this.asfApiService.upload(this.files).pipe(
        catchError(_ => of({ errors: [{ report: 'Error loading files', type: 'ERROR' }]}))
      ).subscribe(
        resp => {
          if (resp.wkt) {
            this.dialogRef.close(resp.wkt.unwrapped);
          } else if (resp.errors && resp.errors.length > 0) {
            const { report, type } = resp.errors[0];
            this.snackBar.open(report, type, { duration: 5000 });
            this.dialogRef.close();
          }
        },
        _ => {
          this.snackBar.open('Error loading geospatial file',  'FILE ERROR', { duration: 3000 });
          this.dialogRef.close();
        }
      )
    );

    this.canBeClosed = false;
    this.dialogRef.disableClose = true;

    this.showCancelButton = false;
  }

  private addFile(file): void {
    const fileName = file.name;
    const size_limit = 10e6;

    if (file.size > size_limit) {
      this.fileError$.next(FileErrors.TOO_LARGE);
      return;
    }

    if (this.isValidFileType(fileName)) {
      this.files.add(file);
    } else {
      this.fileError$.next(FileErrors.INVALID_TYPE);
    }
  }

  private isValidFileType(fileName: string): boolean {
    const validFileTypes = ['zip', 'shp', 'geojson', 'kml'];

    const fileExtension = this.getFileType(fileName);

    return validFileTypes.some(
      ext => ext === fileExtension
    );
  }

  private getFileType(fileName: string): string {
    return fileName.split('.').pop().toLowerCase();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
