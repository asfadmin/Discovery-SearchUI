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

  public updatePriority(isChecked: boolean): void {
    if(isChecked) {
      this.mapService.enablePriority();
    }
    else {
      this.mapService.disablePriority();
    }
  }

  public onUpdateDeformation(isChecked): void {
    if (isChecked) {
      this.onSetDisplacementLayer(this.flightDir, models.DisplacementLayerTypes.DISPLACEMENT);
    } else {
      this.clearDisplacementLayer();
    }
  }

  public onSetDisplacementLayer(direction: models.FlightDirection, type: models.DisplacementLayerTypes) {
    this.mapService.setDisplacementOverview(direction, type);
  }

  public clearDisplacementLayer() {
    this.mapService.clearDisplacementOverview();
  }
}
