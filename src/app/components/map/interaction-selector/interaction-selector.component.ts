import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { MapInteractionModeType } from '@models';

@Component({
  selector: 'app-interaction-selector',
  templateUrl: './interaction-selector.component.html',
  styleUrls: ['./interaction-selector.component.scss']
})
export class InteractionSelectorComponent {
  @Input() interaction: MapInteractionModeType;

  @Output() newInteraction = new EventEmitter<MapInteractionModeType>();

  public types = MapInteractionModeType;

  public onDrawSelected =
    () => this.newInteraction.emit(MapInteractionModeType.DRAW)

  public onEditSelected =
    () => this.newInteraction.emit(MapInteractionModeType.EDIT)

  public onUploadSelected =
    () => this.newInteraction.emit(MapInteractionModeType.UPLOAD)
}
