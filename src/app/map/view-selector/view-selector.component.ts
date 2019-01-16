import { Component, Output, EventEmitter } from '@angular/core';

import { MapViewType } from '../../models';

@Component({
  selector: 'app-view-selector',
  template: `
    <mat-button-toggle-group class="position-1" name="viewSelect" aria-label="Font Style">
      <mat-button-toggle (click)="onArcticSelected()" >
        <div class="view-btn arctic"></div>
      </mat-button-toggle>
      <mat-button-toggle (click)="onEquitorialSelected()" >
        <div class="view-btn equatorial"></div>
      </mat-button-toggle>

      <mat-button-toggle (click)="onAntarcticSelected()" >
        <div class="view-btn antarctic"></div>
      </mat-button-toggle>
    </mat-button-toggle-group>
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
