import { Component } from '@angular/core';

import { MapService } from '@services';
import * as models from '@models';


@Component({
  selector: 'app-displacement-layers',
  templateUrl: './displacement-layers.component.html',
  styleUrl: './displacement-layers.component.scss'
})
export class DisplacementLayersComponent {
  public flightDir = models.FlightDirection.ASCENDING;
  constructor(
    private mapService: MapService,
  ) { }

  public onUpdatePriority(isChecked: boolean): void {
    if(isChecked) {
      this.mapService.enablePriority();
    }
    else {
      this.mapService.disablePriority();
    }
  }

  public onUpdateDeformation(isChecked: boolean): void {
    if (isChecked) {
      this.setDisplacementLayer(this.flightDir, models.DisplacementLayerTypes.DISPLACEMENT);
    } else {
      this.clearDisplacementLayer();
    }
  }

  public onUpdateVelocity(isChecked: boolean): void {
    if (isChecked) {
      this.setDisplacementLayer(this.flightDir, models.DisplacementLayerTypes.VELOCITY);
    } else {
      this.clearDisplacementLayer();
    }
  }

  public setDisplacementLayer(direction: models.FlightDirection, type: models.DisplacementLayerTypes) {
    this.mapService.setDisplacementOverview(direction, type);
  }

  public clearDisplacementLayer() {
    this.mapService.clearDisplacementOverview();
  }
}
