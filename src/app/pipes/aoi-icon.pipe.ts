import {Pipe, PipeTransform} from '@angular/core';
import { MapDrawModeType } from '@models';

@Pipe({
  name: 'aoiIcon',
  pure: false
})


export class AoiIconPipe implements PipeTransform {
  public icon: string;
  transform(drawMode: MapDrawModeType) {
    const types = MapDrawModeType;
    console.log('AoiIconPipe drawMode:', drawMode);
    switch (drawMode) {
      case (types.POINT):
        this.icon =  'place';
        break;
      case (types.LINESTRING):
        this.icon =  'timeline';
        break;
      case (types.POLYGON):
        this.icon = 'pentagon';
        break;
      case (types.BOX):
        this.icon =  'crop_square';
        break;
      case (types.CIRCLE):
        this.icon =  'circle';
        break;
      default:
        this.icon =  'place';
        break
    }
    return this.icon;
  }
}
