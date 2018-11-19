import { Component, OnInit, Input } from '@angular/core';

import { Platform } from '../../models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.css']
})
export class OtherSelectorComponent implements OnInit {
  @Input() selected: Platform[];

  constructor() { }

  ngOnInit() {
  }

  public beamModes(): string[] {
    return this.selected.reduce(
      (modes, platform) => [...modes, ...platform.beamModes], []
    );
  }
}
