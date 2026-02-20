import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UAParser } from 'ua-parser-js';
import { MatTooltip } from '@angular/material/tooltip';
import { MatMenuItem } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-download-all',
  templateUrl: './download-all.component.html',
  styleUrls: ['./download-all.component.scss'],
  imports: [MatTooltip, MatMenuItem, TranslateModule],
})
export class DownloadAllComponent implements OnInit {
  @Output() dlAllEvent = new EventEmitter();
  @Input() disabled = false;
  public isDownloadSupported = false;

  ngOnInit(): void {
    this.isDownloadSupported = new UAParser().getBrowser().name === 'Chrome';
  }

  public downloadAll(): void {
    this.dlAllEvent.emit();
  }
}
