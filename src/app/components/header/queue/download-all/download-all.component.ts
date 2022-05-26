import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { UAParser } from 'ua-parser-js';

@Component({
  selector: 'app-download-all',
  templateUrl: './download-all.component.html',
  styleUrls: ['./download-all.component.scss']
})
export class DownloadAllComponent implements OnInit {
  @Output() dlAllEvent = new EventEmitter();
  @Input() disabled = false;
  public isDownloadSupported = false;

  constructor() { }

  ngOnInit(): void {
    this.isDownloadSupported = new UAParser().getBrowser().name === 'Chrome';
  }

  public downloadAll(): void {
    this.dlAllEvent.emit();
  }

}
