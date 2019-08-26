import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatButtonToggle } from '@angular/material';
import { Observable } from 'rxjs';

import { MapInteractionModeType } from '@models';

@Component({
  selector: 'app-interaction-selector',
  templateUrl: './interaction-selector.component.html',
  styleUrls: ['./interaction-selector.component.scss']
})
export class InteractionSelectorComponent {
  @ViewChild('clearButton' , { static: false }) clearButton: MatButtonToggle;
  @Input() interaction: MapInteractionModeType;

  @Output() newInteraction = new EventEmitter<MapInteractionModeType>();
  @Output() clearPolygon = new EventEmitter<void>();

  public types = MapInteractionModeType;

  public onDrawSelected =
    () => this.newInteraction.emit(MapInteractionModeType.DRAW)

  public onEditSelected =
    () => this.newInteraction.emit(MapInteractionModeType.EDIT)

  public onClearSelected =
    () => {
      this.clearPolygon.emit();
      this.clearButton.checked = false;
    }
}


