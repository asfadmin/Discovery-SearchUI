import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import { ScreenSizeService } from '@services';
import { MapDrawModeType, MapInteractionModeType, Breakpoints } from '@models';

@Component({
  selector: 'app-draw-selector',
  templateUrl: './draw-selector.component.html',
  styleUrls: ['./draw-selector.component.scss']
})
export class DrawSelectorComponent implements OnInit, OnDestroy {
  public drawMode: MapDrawModeType;
  public types = MapDrawModeType;
  private subs = new SubSink();

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(mapStore.getMapDrawMode).subscribe(
        drawMode => this.drawMode = drawMode
      )
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public onImportSelected() {
    const action = new uiStore.OpenAOIOptions();
    this.store$.dispatch(action);
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
