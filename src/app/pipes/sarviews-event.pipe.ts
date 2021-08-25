import { Pipe, PipeTransform } from '@angular/core';
import { SarviewsEvent, SarviewsFloodEvent, SarviewsQuakeEvent, SarviewsVolcanicEvent } from '@models';

@Pipe({
    name: 'quakeEvent'
})
export class quakePipe implements PipeTransform {
    transform(input: SarviewsEvent): SarviewsQuakeEvent {
        return input as SarviewsQuakeEvent;
    }
}

@Pipe({
  name: 'volcanicEvent'
})
export class volcanoPipe implements PipeTransform {
  transform(input: SarviewsEvent): SarviewsVolcanicEvent {
      return input as SarviewsVolcanicEvent;
  }
}

@Pipe({
  name: 'floodEvent'
})
export class floodPipe implements PipeTransform {
  transform(input: SarviewsEvent): SarviewsFloodEvent {
      return input as SarviewsFloodEvent;
  }
}
