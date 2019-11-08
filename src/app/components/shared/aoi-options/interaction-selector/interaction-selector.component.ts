import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { MatButtonToggle } from '@angular/material';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as filterStore from '@store/filters';

import { SearchType, MapInteractionModeType } from '@models';
import * as services from '@services';

@Component({
  selector: 'app-interaction-selector',
  templateUrl: './interaction-selector.component.html',
  styleUrls: ['./interaction-selector.component.scss']
})
export class InteractionSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('clearButton' , { static: false }) clearButton: MatButtonToggle;
  public interaction: MapInteractionModeType;
  public types = MapInteractionModeType;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
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

  public onClearSelected = () => {
    this.clearButton.checked = false;
    this.mapService.clearDrawLayer();

    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
