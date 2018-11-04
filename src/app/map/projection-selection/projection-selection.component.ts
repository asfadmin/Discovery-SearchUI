import { Component, Output, EventEmitter } from '@angular/core';

import { MapView } from '../../models';

@Component({
  selector: 'app-projection-selection',
  template: `
    <div class="position">
      <div class="btn-group" role="group" aria-label="Projection Selection">
        <button (click)="onArcticSelected()"
          type="button" class="btn btn-light arctic"></button>
        <button (click)="onEquitorialSelected()"
          type="button" class="btn btn-light equatorial"></button>
        <button (click)="onAntarcticSelected()"
          type="button" class="btn btn-light antarctic"></button>
      </div>
    </div>
  `,
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
