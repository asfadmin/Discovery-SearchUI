import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { SubSink } from 'subsink';

import * as services from '@services';
import { asfWebsite } from '@models';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
} from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DocsModalComponent } from '../../docs-modal/docs-modal.component';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

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
    NgFor,
    MatOption,
    CdkTextareaAutosize,
    NgIf,
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
