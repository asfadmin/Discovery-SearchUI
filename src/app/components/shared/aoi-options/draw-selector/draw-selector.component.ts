import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import { ScreenSizeService } from '@services';
import { MapDrawModeType, MapInteractionModeType, Breakpoints, SearchType } from '@models';
import {ThemePalette} from '@angular/material/core';

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
  public searchType: SearchType;
  public searchTypes = SearchType;
  public breakpoints = Breakpoints;

  public interaction: MapInteractionModeType;
  public interactionTypes = MapInteractionModeType;

  public isDrawing = true;
  isDisabled = false;
  color: ThemePalette = 'accent';

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) {
    this.onPointSelected()
  }

  ngOnInit() {

    this.subs.add(
      this.store$.select(mapStore.getMapInteractionMode).subscribe(
        mode => this.isDrawing = mode === MapInteractionModeType.DRAW
      )
    );

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

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public toggleDrawMode() {
    let newMode = MapInteractionModeType.DRAW;
    if (this.isDrawing) {
      newMode = MapInteractionModeType.NONE;
    }
    this.onNewInteractionMode(newMode);
  }

  public onNewInteractionMode(mode: MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
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

  public onCircleSelected =
    () => this.selectMode(MapDrawModeType.CIRCLE)

  private selectMode(mode): void {
    this.onNewDrawMode(mode);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected readonly MapDrawModeType = MapDrawModeType;
}
