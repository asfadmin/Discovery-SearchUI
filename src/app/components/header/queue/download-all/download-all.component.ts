import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download-all',
  templateUrl: './download-all.component.html',
  styleUrls: ['./download-all.component.scss']
})
export class DownloadAllComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public downloadAll(): void {
  console.log('downloadAll() is executing.');
  }

}
