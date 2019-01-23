import { Component, OnInit, Input } from '@angular/core';

import { Platform } from '@models';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss']
})
export class DateSelectorComponent implements OnInit {
  @Input() selected: Platform;

  constructor() { }

  ngOnInit() {
  }
}
