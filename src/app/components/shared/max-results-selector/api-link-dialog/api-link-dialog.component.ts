import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';

import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, withLatestFrom, filter } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

import * as services from '@services';

@Component({
  selector: 'app-api-link-dialog',
  templateUrl: './api-link-dialog.component.html',
  styleUrls: ['./api-link-dialog.component.css']
})
export class ApiLinkDialogComponent implements OnInit {
  public amount$ = new BehaviorSubject<number>(5000);
  public format$ = new BehaviorSubject<string>('CSV');

  public format: string;
  public amount: number;

  public apiLink: string;

  public formats = [
    {
      value: 'CSV',
      viewValue: 'CSV File'
    },
    {
      value: 'JSON',
      viewValue: 'JSON File'
    },
    {
      value: 'KML',
      viewValue: 'KML File'
    },
    {
      value: 'METALINK',
      viewValue: 'METALINK File'
    },
    {
      value: 'DOWNLOAD',
      viewValue: 'Bulk Download Script'
    },
    {
      value: 'GEOJSON',
      viewValue: 'GEOJSON File'
    },
  ];

  constructor(
    private asfApiService: services.AsfApiService,
    private searchParams: services.SearchParamsService,
    private clipboard: ClipboardService,
    private dialogRef: MatDialogRef<ApiLinkDialogComponent>,
  ) { }

  ngOnInit() {
    this.amount$.subscribe(
      amount => this.amount = amount
    );

    this.format$.subscribe(
      format => this.format = format
    );

    combineLatest(
      this.amount$, this.format$
    ).pipe(
      filter(([amount, format]) => !!amount && !!format),
      withLatestFrom(this.searchParams.getParams()),
      map(([[format, amount], params]) => {
        return {
          ...params,
          output: amount,
          maxResults: format
        };
      }),
      map(params => this.asfApiService.queryUrlFrom(params))
    ).subscribe(apiLink => this.apiLink = apiLink);
  }

  public onAmountChange(amount: string): void {
    this.amount$.next(+amount);
  }

  public onFormatChange(format: string): void {
    this.format$.next(format);
  }

  public onCopyLink(): void {
    this.clipboard.copyFromContent(this.apiLink);
  }

  public onCloseDownloadQueue(): void {
    this.dialogRef.close();
  }
}
