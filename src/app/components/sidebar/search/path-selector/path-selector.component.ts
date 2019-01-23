import { Component, OnInit, Input } from '@angular/core';

import { Platform } from '@models';

@Component({
  selector: 'app-path-selector',
  templateUrl: './path-selector.component.html',
  styleUrls: ['./path-selector.component.scss']
})
export class PathSelectorComponent implements OnInit {
  @Input() selected: Platform[];

  constructor() { }

  ngOnInit() {
  }

}
