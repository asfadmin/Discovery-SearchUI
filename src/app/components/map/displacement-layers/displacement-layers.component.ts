import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { MapService } from '@services';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { getFlightDirections } from '@store/filters';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import * as mapStore from '@store/map';
import { getVelocityOverlayOpacity } from '@store/map';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { MapLegendComponent } from './map-legend/map-legend.component';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-displacement-layers',
  templateUrl: './displacement-layers.component.html',
  styleUrl: './displacement-layers.component.scss',
  imports: [
    MatCheckbox,
    DocsModalComponent,
    MapLegendComponent,
    MatSlider,
    MatTooltip,
    MatSliderThumb,
    FormsModule,
    TranslateModule,
  ],
})
export class DisplacementLayersComponent implements OnInit, OnDestroy {
  mapService = inject(MapService);
  private store$ = inject<Store<AppState>>(Store);

  @ViewChild('priorityRollout', { static: true }) priorityCheckbox: MatCheckbox;
  @ViewChild('velocityOpacitySlider') _slider: MatSlider;
  public flightDir = models.FlightDirection.ASCENDING;
  public displacementOverview: models.DisplacementLayerTypes | null = null;
  public cumulativeDisplacementSelectionEnabled = false;
  public DispLayerTypes = models.DisplacementLayerTypes;
  private subs = new SubSink();
  public velocityOverlayOpacity: number;

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(getVelocityOverlayOpacity)
        .subscribe(
          (velocityOverlayOpacity) =>
            (this.velocityOverlayOpacity = velocityOverlayOpacity),
        ),
    );

    this.subs.add(
      this.mapService.displacementOverview$
        .pipe(filter((overview) => !!overview))
        .subscribe((t) => {
          this.displacementOverview = t;
          this.cumulativeDisplacementSelectionEnabled = true;
        }),
    );
    this.subs.add(
      this.store$
        .select(getFlightDirections)
        .pipe(
          map(
            (flightDirs) => flightDirs[0] ?? models.FlightDirection.ASCENDING,
          ),
          distinctUntilChanged(),
        )
        .subscribe((flightDir) => {
          this.flightDir = flightDir;
          if (this.displacementOverview) {
            this.setDisplacementLayer(
              this.flightDir,
              this.displacementOverview,
            );
          } else {
            this.setDisplacementLayer(
              this.flightDir,
              models.DisplacementLayerTypes.VELOCITY,
            );
          }
        }),
    );
  }

  public onUpdateLayerType(layerType: models.DisplacementLayerTypes): void {
    if (this.cumulativeDisplacementSelectionEnabled) {
      this.clearDisplacementLayer();
      this.setDisplacementLayer(this.flightDir, layerType);
    }
  }

  public onToggleDisplacementLayerDisplay(checked: boolean): void {
    this.cumulativeDisplacementSelectionEnabled = checked;
    this.displacementOverview = models.DisplacementLayerTypes.DISPLACEMENT;
    if (checked && this.displacementOverview) {
      this.setDisplacementLayer(this.flightDir, this.displacementOverview);
    } else {
      this.clearDisplacementLayer();
      this.displacementOverview = null;
    }
  }

  public onToggleVelocityLayerDisplay(checked: boolean): void {
    this.cumulativeDisplacementSelectionEnabled = checked;
    this.displacementOverview = models.DisplacementLayerTypes.VELOCITY;
    if (checked && this.displacementOverview) {
      this.setDisplacementLayer(this.flightDir, this.displacementOverview);
    } else {
      this.clearDisplacementLayer();
      this.displacementOverview = null;
    }
  }

  public onSetVelocityOpacity(event: any) {
    this.store$.dispatch(
      new mapStore.SetVelocityOverlayOpacity(+event.target.value),
    );
  }

  public formatLabel(value: number): string {
    return (value * 100).toFixed(0).toString() + '%';
  }

  public onSliderDragEnd(_event: any) {
    _event.target.blur();
  }

  public setDisplacementLayer(
    direction: models.FlightDirection,
    type: models.DisplacementLayerTypes,
  ) {
    this.mapService.setDisplacementOverview(direction, type);
    this.mapService.updateVelocityOpacity(this.velocityOverlayOpacity);
  }

  public clearDisplacementLayer() {
    this.mapService.clearDisplacementOverview();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.mapService.clearDisplacementOverview();
  }
}
