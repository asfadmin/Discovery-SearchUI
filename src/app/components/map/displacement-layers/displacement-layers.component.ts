import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { MapService } from '@services';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { getFlightDirections } from '@store/filters';
import { distinctUntilChanged, map } from 'rxjs';


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
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.mapService.displacementOverview$.subscribe(
        t => {
          this.displacementOverview = t;
        }
      )
    );
    this.subs.add(
      this.store$.select(getFlightDirections).pipe(
        map(flightDirs => flightDirs[0] ?? models.FlightDirection.ASCENDING),
        distinctUntilChanged(),
      ).subscribe(flightDir => {
        this.flightDir = flightDir;
        if (!!this.displacementOverview) {
          this.setDisplacementLayer(this.flightDir, this.displacementOverview)
        }
      }
      )
    )
  }

  public onUpdatePriority(isChecked: boolean): void {
    if (isChecked) {
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
