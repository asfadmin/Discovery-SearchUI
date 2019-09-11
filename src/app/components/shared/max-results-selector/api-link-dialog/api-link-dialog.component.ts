import { Component, OnInit } from '@angular/core';

import { Subject, combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import * as services from '@services';

@Component({
  selector: 'app-api-link-dialog',
  templateUrl: './api-link-dialog.component.html',
  styleUrls: ['./api-link-dialog.component.css']
})
export class ApiLinkDialogComponent implements OnInit {
  public amount$ = new Subject<number>();
  public format$ = new Subject<string>();

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
    private searchParams: services.SearchParamsService
  ) { }

  ngOnInit() {
    combineLatest(
      this.amount$, this.format$
    ).pipe(
      withLatestFrom(this.searchParams.getParams()),
    //.pipe(
      //map(params => {
        //let newParams = params;
        //if (this.selectedFormat !== null) {
          //newParams = [params, {...params, output: this.selectedFormat}];
        //}
        //if (this.amount !== null) {
          //newParams = [params, {...params, maxResults: this.amount}];
        //}

        //return newParams;
      //}),
    ).subscribe(console.log);
  }

  private onAmountChange(amount: string): void {
    console.log(amount, typeof amount);
  }

  private onFormatChange(format): void {
    console.log(format, typeof format);
  }
}
