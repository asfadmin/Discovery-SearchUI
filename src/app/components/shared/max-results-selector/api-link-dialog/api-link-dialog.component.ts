import { CdkScrollable } from '@angular/cdk/scrolling';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
} from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { asfWebsite } from '@models';
import * as services from '@services';

import { DocsModalComponent } from '../../docs-modal/docs-modal.component';

@Component({
  selector: 'app-api-link-dialog',
  templateUrl: './api-link-dialog.component.html',
  styleUrls: ['./api-link-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,

    MatOption,
    CdkTextareaAutosize,

    MatIcon,
    MatSuffix,
    MatTooltip,
    MatDialogActions,
    DocsModalComponent,
    MatButton,
    MatDialogClose,
    TranslateModule,
  ],
})
export class ApiLinkDialogComponent implements OnInit, OnDestroy {
  private asfApiService = inject(services.AsfApiService);
  private searchParams = inject(services.SearchParamsService);
  private clipboard = inject(ClipboardService);
  private dialogRef =
    inject<MatDialogRef<ApiLinkDialogComponent>>(MatDialogRef);
  private notificationService = inject(services.NotificationService);

  public amount$ = new BehaviorSubject<number>(5000);
  public format$ = new BehaviorSubject<string>('CSV');
  public asfWebsite = asfWebsite;

  public format: string;
  public amount: number;
  public apiLink: string;
  private subs = new SubSink();

  public formats = [
    {
      value: 'CSV',
      viewValue: 'CSV File',
    },
    {
      value: 'JSON',
      viewValue: 'JSON File',
    },
    {
      value: 'KML',
      viewValue: 'KML File',
    },
    {
      value: 'METALINK',
      viewValue: 'METALINK File',
    },
    {
      value: 'DOWNLOAD',
      viewValue: 'Bulk Download Script',
    },
    {
      value: 'GEOJSON',
      viewValue: 'GEOJSON File',
    },
  ];

  ngOnInit() {
    this.subs.add(
      combineLatest([this.amount$, this.format$])
        .pipe(
          tap(([amount, format]) => {
            this.amount = amount;
            this.format = format;
          }),
          filter(([amount, format]) => !!amount && !!format),
          withLatestFrom(this.searchParams.getParams),
          map(([[format, amount], params]) => {
            return {
              ...params,
              output: amount,
              maxResults: format,
            };
          }),
          map((params) =>
            this.asfApiService.queryUrlFrom(params, {
              apiUrl: 'https://api.daac.asf.alaska.edu',
            }),
          ),
        )
        .subscribe((apiLink) => (this.apiLink = apiLink)),
    );
  }

  public onAmountChange(event: Event): void {
    const amount = (event.target as HTMLInputElement).valueAsNumber;
    this.amount$.next(amount);
  }

  public onFormatChange(format: string): void {
    this.format$.next(format);
  }

  public onCopyLink(): void {
    this.clipboard.copyFromContent(this.apiLink);
    this.notificationService.clipboardAPIURL();
  }

  public onCloseDownloadQueue(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
