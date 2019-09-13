import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapDrawModeType, MapInteractionModeType } from '@models';

@Component({
  selector: 'app-draw-selector',
  templateUrl: './draw-selector.component.html',
  styleUrls: ['./draw-selector.component.scss']
})
export class DrawSelectorComponent {
  @Input() drawMode: MapDrawModeType;
  @Input() isDisabled: boolean;

  @Output() newDrawMode = new EventEmitter<MapDrawModeType>();

  public types = MapDrawModeType;

  public onPolygonSelected =
    () => this.selectMode(MapDrawModeType.POLYGON)

  public onLineStringSelected =
    () => this.selectMode(MapDrawModeType.LINESTRING)

  public onPointSelected =
    () => this.selectMode(MapDrawModeType.POINT)

  public onBoxSelected =
    () => this.selectMode(MapDrawModeType.BOX)

  private selectMode(mode): void {
    if (!this.isDisabled) {
      this.newDrawMode.emit(mode);
    }
  }
}
