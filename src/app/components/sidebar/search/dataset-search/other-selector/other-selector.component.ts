import { Component, Input, EventEmitter, Output } from '@angular/core';

import * as models from '@models';

@Component({
  selector: 'app-other-selector',
  templateUrl: './other-selector.component.html',
  styleUrls: ['./other-selector.component.scss']
})
export class OtherSelectorComponent {
  @Input() selected: models.Platform[];
  @Input() productTypes: models.PlatformProductTypes;
  @Input() flightDirections: models.FlightDirection[];
  @Input() beamModes: models.PlatformBeamModes;
  @Input() polarizations: models.PlatformPolarizations;

  @Output() newProductTypes = new EventEmitter<models.PlatformProductTypes>();
  @Output() newFlightDirections = new EventEmitter<models.FlightDirection[]>();
  @Output() newBeamModes = new EventEmitter<models.PlatformBeamModes>();
  @Output() newPolarizations = new EventEmitter<models.PlatformPolarizations>();

  public flightDirectionTypes = models.flightDirections;

  public onNewPlatformBeamModes(platform: models.Platform, beamModes: string[]): void {
    this.newBeamModes.emit({ [platform.name]: beamModes });
  }

  public onNewProductTypes(platform: models.Platform, productTypes: models.ProductType[]): void {
      this.newProductTypes.emit({ [platform.name]: productTypes });
  }

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
    this.newFlightDirections.emit(directions);
  }

  public onNewPlatformPolarizations(platform: models.Platform, polarizations: string[]): void {
    this.newPolarizations.emit({ [platform.name]: polarizations });
  }
}
