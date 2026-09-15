import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, OnInit, OnDestroy, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { SubSink } from 'subsink';

import * as models from '@models';
import {
  AsfApiService,
  AsfLanguageService,
  NotificationService,
  MapService,
  WktService,
  ScreenSizeService,
} from '@services';
import { AppState } from '@store';
import { DrawNewPolygon } from '@store/map';

enum FileErrors {
  TOO_LARGE = 'Too large',
  INVALID_TYPE = 'Invalid Type',
}

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
  imports: [
    MatButton,
    MatProgressSpinner,
    MatButtonToggle,
    MatTooltip,
    MatIcon,
    AsyncPipe,
    TranslateModule,
  ],
})
export class FileUploadDialogComponent implements OnInit, OnDestroy {
  private mapService = inject(MapService);
  private asfApiService = inject(AsfApiService);
  private notificationService = inject(NotificationService);
  private wktService = inject(WktService);
  private screenSize = inject(ScreenSizeService);
  private store$ = inject<Store<AppState>>(Store);
  private language = inject(AsfLanguageService);

  @ViewChild('file', { static: true }) file;

  public files = new Set<File>();
  public canBeClosed = true;
  public uploading = false;

  public fileError$ = new Subject<FileErrors>();
  public isFileError = false;
  private subs = new SubSink();

  public breakpoints = models.Breakpoints;
  public breakpoint$ = this.screenSize.breakpoint$;

  public ngOnInit(): void {
    this.subs.add(
      this.fileError$
        .pipe(
          tap((_) => (this.isFileError = true)),
          tap((error) => {
            if (error === FileErrors.INVALID_TYPE) {
              this.notificationService.error(
                this.language.translate.instant('INVALID_FILE_TYPE'),
                this.language.translate.instant('FILE_ERROR'),
                { timeOut: 5000 },
              );
            } else if (error === FileErrors.TOO_LARGE) {
              this.notificationService.error(
                this.language.translate.instant('FILE_TOO_LARGE'),
                this.language.translate.instant('FILE_ERROR'),
                { timeOut: 5000 },
              );
            }
          }),
          delay(820),
          tap((_) => (this.isFileError = false)),
        )
        .subscribe((_) => _),
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

    if (this.files.size > 0) {
      this.onUpload();
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
    const files: Record<string, File> = this.file.nativeElement.files;

    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.addFile(files[key]);
      }
    }

    if (this.files.size > 0) {
      this.onUpload();
    }
  }

  public onRemoveFile(file): void {
    this.files.delete(file);
  }

  public onUpload(): void {
    this.uploading = true;

    this.subs.add(
      this.asfApiService
        .upload(this.files)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status !== 0) {
              return of({
                errors: [
                  {
                    report: this.language.translate.instant(
                      'ERROR_LOADING_FILES',
                    ),
                    type: this.language.translate.instant('ERROR'),
                  },
                ],
              });
            } else {
              return of({
                errors: [
                  {
                    report: this.language.translate.instant(
                      'FILE_UPLOAD_TIMEOUT',
                    ),
                    type: this.language.translate.instant('ERROR'),
                  },
                ],
              });
            }
          }),
        )
        .subscribe(
          (resp) => {
            this.reset();

            if (resp.wkt) {
              // set wkt (resp.wkt.unwrapped)
              this.setAOI(resp.wkt.unwrapped);
              this.zoomToAOI(resp.wkt.unwrapped);
              this.store$.dispatch(new DrawNewPolygon());
            } else if (resp.errors && resp.errors.length > 0) {
              const { report, type } = resp.errors[0];
              this.notificationService.error(report, type, { timeOut: 5000 });
              // return
            }
          },
          (_) => {
            this.notificationService.error(
              this.language.translate.instant('ERROR_LOADING_GEOSPATIAL_FILE'),
              this.language.translate.instant('FILE_ERROR'),
              { timeOut: 3000 },
            );
            // return
          },
        ),
    );

    this.canBeClosed = false;
  }

  private reset() {
    this.uploading = false;
    this.canBeClosed = true;

    this.files.clear();
  }

  private setAOI(wkt: string) {
    this.mapService.loadPolygonFrom(wkt);
  }

  private zoomToAOI(wkt: string) {
    const feature = this.wktService.wktToFeature(wkt, this.mapService.epsg());
    this.mapService.zoomToFeature(feature);
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
      this.notificationService.info(
        `${this.language.translate.instant('IMPORTING')} '${file.name}'...`,
        this.language.translate.instant('AOI_IMPORT'),
        { timeOut: 5000 },
      );
    } else {
      this.fileError$.next(FileErrors.INVALID_TYPE);
    }
  }

  private isValidFileType(fileName: string): boolean {
    const validFileTypes = ['zip', 'shp', 'geojson', 'kml'];

    const fileExtension = this.getFileType(fileName);

    return validFileTypes.some((ext) => ext === fileExtension);
  }

  private getFileType(fileName: string): string {
    return fileName.split('.').pop().toLowerCase();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
