import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import * as services from '@services';
import { asfWebsite } from '@models';

@Component({
  selector: 'app-api-link-dialog',
  templateUrl: './api-link-dialog.component.html',
  styleUrls: ['./api-link-dialog.component.scss']
})
export class ApiLinkDialogComponent implements OnInit, OnDestroy {
  public amount$ = new BehaviorSubject<number>(5000);
  public format$ = new BehaviorSubject<string>('CSV');
  public asfWebsite = asfWebsite;

  public format: string;
  public amount: number;
  public apiLink: string;
  private subs = new SubSink();

  public formats = [{
      value: 'CSV',
      viewValue: 'CSV File'
    }, {
      value: 'JSON',
      viewValue: 'JSON File'
    }, {
      value: 'KML',
      viewValue: 'KML File'
    }, {
      value: 'METALINK',
      viewValue: 'METALINK File'
    }, {
      value: 'DOWNLOAD',
      viewValue: 'Bulk Download Script'
    }, {
      value: 'GEOJSON',
      viewValue: 'GEOJSON File'
    },
  ];

  constructor(
    private asfApiService: services.AsfApiService,
    private searchParams: services.SearchParamsService,
    private clipboard: ClipboardService,
    private dialogRef: MatDialogRef<ApiLinkDialogComponent>,
    private notificationService: services.NotificationService,
  ) { }

  ngOnInit() {
    this.subs.add(
      combineLatest([
        this.amount$,
        this.format$]
      ).pipe(
        tap(([amount, format]) => {
          this.amount = amount;
          this.format = format;
        }),
        filter(([amount, format]) => !!amount && !!format),
        withLatestFrom(this.searchParams.getParams()),
        map(([[format, amount], params]) => {
          return {
            ...params,
            output: amount,
            maxResults: format
          };
        }),
        map(params => this.asfApiService.queryUrlFrom(params, {
          apiUrl: 'https://api.daac.asf.alaska.edu'
        }))
      ).subscribe(apiLink => this.apiLink = apiLink)
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
