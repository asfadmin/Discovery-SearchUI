import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { MapViewType } from '@models';

@Component({
  selector: 'app-view-selector',
  templateUrl: './view-selector.component.html',
  styleUrls: ['./view-selector.component.scss']
})
export class ViewSelectorComponent {
  @Input() view: MapViewType;

  @Output() newProjection = new EventEmitter<MapViewType>();

  public types = MapViewType;

  public onArcticSelected =
    () => this.newProjection.emit(MapViewType.ARCTIC)

  public onEquitorialSelected =
    () => this.newProjection.emit(MapViewType.EQUITORIAL)

  public onAntarcticSelected =
    () => this.newProjection.emit(MapViewType.ANTARCTIC)
}
