import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SubSink } from 'subsink';

import { MapService } from '@services';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { getFlightDirections } from '@store/filters';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';


@Component({
  selector: 'app-displacement-layers',
  templateUrl: './displacement-layers.component.html',
  styleUrl: './displacement-layers.component.scss'
})
export class DisplacementLayersComponent implements OnInit, OnDestroy {
  @ViewChild("priorityRollout", { static: true }) priorityCheckbox: MatCheckbox;
  public flightDir = models.FlightDirection.ASCENDING;
  public displacementOverview: models.DisplacementLayerTypes | null = null;
  public cumulativeDisplacementSelectionEnabled: boolean = false;
  public DispLayerTypes = models.DisplacementLayerTypes;
  public priorityEnabled = false;
  private subs = new SubSink();

  constructor(
    private mapService: MapService,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.mapService.displacementOverview$.pipe(
        filter(overview => !!overview)
      ).subscribe(
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
        if (this.priorityCheckbox.checked) {
          this.mapService.disablePriority()
          this.onUpdatePriority(this.priorityCheckbox.checked)
        }
      }
      )
    )
    this.subs.add(
      this.mapService.priorityEnabled$.subscribe(t => {
        this.priorityEnabled = t !== null;
      })
    )
  }

  public onUpdatePriority(isChecked: boolean): void {
    if (isChecked) {
      this.mapService.enablePriority(this.flightDir);
    }
    else {
      this.mapService.disablePriority();
    }
  }

  public onUpdateLayerType(layerType: models.DisplacementLayerTypes): void {
    if (this.cumulativeDisplacementSelectionEnabled) {
      this.clearDisplacementLayer();
      this.setDisplacementLayer(this.flightDir, layerType);
    }
  }


  public onToggleCumulativeLayerDisplay(checked: boolean) {
    this.cumulativeDisplacementSelectionEnabled = checked;
    if (checked) {
      this.setDisplacementLayer(this.flightDir, this.displacementOverview)
    } else {
      this.clearDisplacementLayer()
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
