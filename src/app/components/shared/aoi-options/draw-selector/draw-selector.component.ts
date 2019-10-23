import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';

import { SearchType, MapDrawModeType, MapInteractionModeType } from '@models';

@Component({
  selector: 'app-draw-selector',
  templateUrl: './draw-selector.component.html',
  styleUrls: ['./draw-selector.component.scss']
})
export class DrawSelectorComponent implements OnInit, OnDestroy {
  public drawMode: MapDrawModeType;
  public types = MapDrawModeType;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapDrawMode).subscribe(
        drawMode => this.drawMode = drawMode
      )
    );
  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onPolygonSelected =
    () => this.selectMode(MapDrawModeType.POLYGON)

  public onLineStringSelected =
    () => this.selectMode(MapDrawModeType.LINESTRING)

  public onPointSelected =
    () => this.selectMode(MapDrawModeType.POINT)

  public onBoxSelected =
    () => this.selectMode(MapDrawModeType.BOX)

  private selectMode(mode): void {
    this.onNewDrawMode(mode);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
