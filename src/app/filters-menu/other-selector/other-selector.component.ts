import { Component, OnInit, Input } from '@angular/core';

import { Platform, polarizations, flightDirections } from '../../models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.css']
})
export class OtherSelectorComponent implements OnInit {
  @Input() selected: Platform[];
  public polarizations = polarizations;
  public flightDirections = flightDirections;

  constructor() { }

  ngOnInit() {
  }

  public beamModes(): string[] {
    return this.selected.reduce(
      (modes, platform) => [...modes, ...platform.beamModes], []
    );
  }
}
