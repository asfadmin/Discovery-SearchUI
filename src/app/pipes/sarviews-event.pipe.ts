import { Pipe, PipeTransform } from '@angular/core';
import { SarviewsEvent, SarviewsQuakeEvent, SarviewsVolcanicEvent } from '@models';

@Pipe({
    name: 'quakeEvent',
    standalone: false
})
export class QuakePipe implements PipeTransform {
    transform(input: SarviewsEvent): SarviewsQuakeEvent {
        return input as SarviewsQuakeEvent;
    }
}

@Pipe({
    name: 'volcanicEvent',
    standalone: false
})
export class VolcanoPipe implements PipeTransform {
  transform(input: SarviewsEvent): SarviewsVolcanicEvent {
      return input as SarviewsVolcanicEvent;
  }
}

// @Pipe({
//   name: 'floodEvent'
// })
// export class floodPipe implements PipeTransform {
//   transform(input: SarviewsEvent): SarviewsFloodEvent {
//       return input as SarviewsFloodEvent;
//   }
// }
