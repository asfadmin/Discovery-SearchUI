import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-link-dialog',
  templateUrl: './api-link-dialog.component.html',
  styleUrls: ['./api-link-dialog.component.css']
})
export class ApiLinkDialogComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
  }

}
