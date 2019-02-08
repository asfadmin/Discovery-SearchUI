import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { MapDrawModeType } from '@models';

@Component({
  selector: 'app-draw-selector',
  templateUrl: './draw-selector.component.html',
  styleUrls: ['./draw-selector.component.css']
})
export class DrawSelectorComponent {
  @Input() drawMode: MapDrawModeType;

  @Output() newDrawMode = new EventEmitter<MapDrawModeType>();

  public types = MapDrawModeType;

  public onPolygonSelected =
    () => this.newDrawMode.emit(MapDrawModeType.POLYGON)

  public onLineStringSelected =
    () => this.newDrawMode.emit(MapDrawModeType.LINESTRING)

  public onPointSelected =
    () => this.newDrawMode.emit(MapDrawModeType.POINT)

  public onBoxSelected =
    () => this.newDrawMode.emit(MapDrawModeType.BOX)
}
