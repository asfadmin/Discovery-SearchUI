import { Pipe, PipeTransform } from '@angular/core';
import { MapDrawModeType } from '@models';

@Pipe({
    name: 'aoiIcon',
    pure: false,
    standalone: false
})
export class AoiIconPipe implements PipeTransform {
  public icon: string;
  transform(drawMode: MapDrawModeType) {
    const types = MapDrawModeType;
    switch (drawMode) {
      case types.POINT:
        this.icon = 'place';
        break;
      case types.LINESTRING:
        this.icon = 'timeline';
        break;
      case types.POLYGON:
        this.icon = 'hexagon';
        break;
      case types.BOX:
        this.icon = 'crop_square';
        break;
      case types.CIRCLE:
        this.icon = 'adjust';
        break;
      default:
        this.icon = 'place';
        break;
    }
    return this.icon;
  }
}
