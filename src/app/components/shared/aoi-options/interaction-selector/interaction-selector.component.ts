import { AsyncPipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { MapInteractionModeType } from '@models';
import * as models from '@models';
import * as services from '@services';
import { AppState } from '@store';
import * as mapStore from '@store/map';
import * as uiStore from '@store/ui';

import { DrawSelectorComponent } from '../draw-selector/draw-selector.component';
import { FileUploadDialogComponent } from '../file-upload/file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-interaction-selector',
  templateUrl: './interaction-selector.component.html',
  styleUrls: ['./interaction-selector.component.scss'],
  imports: [
    MatButtonToggleGroup,
    DrawSelectorComponent,
    MatButtonToggle,
    MatTooltip,
    MatIcon,

    FileUploadDialogComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class InteractionSelectorComponent {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(services.MapService);
  private screenSize = inject(services.ScreenSizeService);

  @ViewChild('clearButton') clearButton: MatButtonToggle;
  public interaction = this.store$.selectSignal(mapStore.getMapInteractionMode);
  public types = MapInteractionModeType;

  public breakpoints = models.Breakpoints;
  public breakpoint$ = this.screenSize.breakpoint$;

  public onNewInteractionMode(mode: MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onDrawSelected = () =>
    this.onNewInteractionMode(
      this.interaction() === MapInteractionModeType.DRAW
        ? MapInteractionModeType.NONE
        : MapInteractionModeType.DRAW,
    );

  public onEditSelected = () =>
    this.onNewInteractionMode(
      this.interaction() === MapInteractionModeType.EDIT
        ? MapInteractionModeType.NONE
        : MapInteractionModeType.EDIT,
    );

  public onImportSelected() {
    const action = new uiStore.OpenAOIOptions();
    this.store$.dispatch(action);
  }

  public onClearSelected = () => {
    this.clearButton.checked = false;
    this.mapService.clearDrawLayer();

    this.store$.dispatch(
      new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW),
    );
  };
}
