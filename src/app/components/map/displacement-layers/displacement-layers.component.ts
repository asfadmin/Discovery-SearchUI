import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { MapService } from '@services';
import * as models from '@models';


@Component({
  selector: 'app-displacement-layers',
  templateUrl: './displacement-layers.component.html',
  styleUrl: './displacement-layers.component.scss'
})
export class DisplacementLayersComponent implements OnInit, OnDestroy {
  public flightDir = models.FlightDirection.ASCENDING;
  public displacementOverview: models.DisplacementLayerTypes | null = null;

  public DispLayerTypes = models.DisplacementLayerTypes;

  private subs = new SubSink();

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.mapService.displacementOverview$.subscribe(
        t => {
          this.displacementOverview = t;
        }
      )
    );
  }

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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
