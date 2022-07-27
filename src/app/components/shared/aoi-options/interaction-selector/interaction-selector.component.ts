import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import { MapInteractionModeType } from '@models';
import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-interaction-selector',
  templateUrl: './interaction-selector.component.html',
  styleUrls: ['./interaction-selector.component.scss']
})
export class InteractionSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('clearButton') clearButton: MatButtonToggle;
  public interaction: MapInteractionModeType;
  public types = MapInteractionModeType;

  public breakpoints = models.Breakpoints;
  public breakpoint$ = this.screenSize.breakpoint$;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private screenSize: services.ScreenSizeService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapInteractionMode).subscribe(
        interaction => this.interaction = interaction
      )
    );
  }

  public onNewInteractionMode(mode: MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onDrawSelected =
    () => this.onNewInteractionMode(
      this.interaction === MapInteractionModeType.DRAW ? MapInteractionModeType.NONE : MapInteractionModeType.DRAW
    )

  public onEditSelected =
    () => this.onNewInteractionMode(
      this.interaction === MapInteractionModeType.EDIT ? MapInteractionModeType.NONE : MapInteractionModeType.EDIT
      )

  public onImportSelected() {
    const action = new uiStore.OpenAOIOptions();
    this.store$.dispatch(action);
  }

  public onClearSelected = () => {
    this.clearButton.checked = false;
    this.mapService.clearDrawLayer();

    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
