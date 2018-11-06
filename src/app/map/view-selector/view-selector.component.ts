import { Component, Output, EventEmitter } from '@angular/core';

import { MapViewType } from '../../models';

@Component({
  selector: 'app-view-selector',
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
