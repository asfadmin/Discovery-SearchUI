import { Component, Output, EventEmitter } from '@angular/core';

import { MapViewType } from '../../models';

@Component({
  selector: 'app-view-selector',
  templateUrl: './view-selector.component.html',
  styleUrls: ['./view-selector.component.css']
})
export class ViewSelectorComponent {
  @Output() newProjection = new EventEmitter<MapViewType>();

  public onArcticSelected =
    () => this.newProjection.emit(MapViewType.ARCTIC)

  public onEquitorialSelected =
    () => this.newProjection.emit(MapViewType.EQUITORIAL)

  public onAntarcticSelected =
    () => this.newProjection.emit(MapViewType.ANTARCTIC)
}
