import { Component, Output, EventEmitter } from '@angular/core';

import { MapViewType } from '../../models';

@Component({
  selector: 'app-view-selector',
  template: `
    <div class="position-1">
      <button  (click)="onArcticSelected()"
        type="button" class="btn btn-light arctic"></button>
    </div>

    <div class="position-2">
      <button  (click)="onEquitorialSelected()"
        type="button" class="btn btn-light equatorial"></button>
    </div>

    <div class="position-3">
      <button  (click)="onAntarcticSelected()"
        type="button" class="btn btn-light antarctic"></button>
    </div>
  `,
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
