import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { SubSink } from 'subsink';

import {
  MapDrawModeType,
  MapInteractionModeType,
  Breakpoints,
  SearchType,
} from '@models';
import { AoiIconPipe } from '@pipes/aoi-icon.pipe';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-draw-selector',
  templateUrl: './draw-selector.component.html',
  styleUrls: ['./draw-selector.component.scss'],
  imports: [
    MatButton,
    MatMenuTrigger,
    MatIcon,
    MatSlideToggle,
    MatMenu,
    MatMenuItem,
    TitleCasePipe,
    TranslateModule,
    AoiIconPipe,
  ],
})
export class DrawSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public drawMode = this.store$.selectSignal(mapStore.getMapDrawMode);
  public types = MapDrawModeType;
  private subs = new SubSink();

  public breakpoint: Breakpoints;
  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = SearchType;
  public breakpoints = Breakpoints;

  public interactionMode = this.store$.selectSignal(
    mapStore.getMapInteractionMode,
  );
  public interaction: MapInteractionModeType;
  public interactionTypes = MapInteractionModeType;

  public isDrawing = computed(() => {
    return this.interactionMode() === MapInteractionModeType.DRAW;
  });
  isDisabled = false;
  color: ThemePalette = 'accent';

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );
  }

  public onNewDrawMode(mode: MapDrawModeType): void {
    this.store$.dispatch(
      new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW),
    );
    this.store$.dispatch(new mapStore.SetMapDrawMode(mode));
  }

  public toggleDrawMode() {
    let newMode = MapInteractionModeType.DRAW;
    if (this.isDrawing()) {
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

  public onPolygonSelected = () => this.selectMode(MapDrawModeType.POLYGON);

  public onLineStringSelected = () =>
    this.selectMode(MapDrawModeType.LINESTRING);

  public onPointSelected = () => this.selectMode(MapDrawModeType.POINT);

  public onBoxSelected = () => this.selectMode(MapDrawModeType.BOX);

  public onCircleSelected = () => this.selectMode(MapDrawModeType.CIRCLE);

  private selectMode(mode): void {
    this.onNewDrawMode(mode);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  protected readonly MapDrawModeType = MapDrawModeType;
}
