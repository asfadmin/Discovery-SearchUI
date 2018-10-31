import { Component, Output, EventEmitter } from '@angular/core';

import { MapView } from '../../models';

@Component({
  selector: 'app-projection-selection',
  templateUrl: './projection-selection.component.html',
  styleUrls: ['./projection-selection.component.css']
})
export class ProjectionSelectionComponent {
  @Output() newProjection = new EventEmitter<MapView>();

  public onArcticSelected =
    () => this.newProjection.emit(MapView.ARCTIC)

  public onEquitorialSelected =
    () => this.newProjection.emit(MapView.EQUITORIAL)

  public onAntarcticSelected =
    () => this.newProjection.emit(MapView.ANTARCTIC)
}
