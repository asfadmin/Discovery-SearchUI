import { Component, Input } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss']
})
export class OtherSelectorComponent {
  @Input() selected: models.Platform[];

  public polarizations = models.polarizations;
  public flightDirections = models.flightDirections;

  public beamModes(): string[] {
    return this.selected.reduce(
      (modes, platform) => [...modes, ...platform.beamModes], []
    );
  }
}
