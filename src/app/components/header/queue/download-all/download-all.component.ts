import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-download-all',
  templateUrl: './download-all.component.html',
  styleUrls: ['./download-all.component.scss']
})
export class DownloadAllComponent implements OnInit {
  @Output() dlAllEvent = new EventEmitter();
  @Input() disabled = false;
  constructor() { }

  ngOnInit(): void {
  }

  public downloadAll(): void {
    this.dlAllEvent.emit();
  }

}
