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

  @Output() newProductType = new EventEmitter<models.PlatformProductType>();
  @Output() removeProductType = new EventEmitter<models.PlatformProductType>();
  @Output() newFlightDirections = new EventEmitter<models.FlightDirection[]>();

  public flightDirectionTypes = models.flightDirections;

  public beamModes(): string[] {
    return this.selected.reduce(
      (modes, platform) => [...modes, ...platform.beamModes], []
    );
  }

  public onTypesChanged(e): void {
    console.log(e);
  }

  public onTypeSelected(platform: string, productType: models.ProductType): void {
    const types = this.productTypes[platform] || [];

    if (types.includes(productType)) {
      this.removeProductType.emit({ platform, productType });
    } else {
      this.newProductType.emit({ platform, productType });
    }
  }

  public onNewFlightDirectionsSelected(directions: models.FlightDirection[]): void {
    this.newFlightDirections.emit(directions);
  }
}
