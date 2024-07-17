import { Pipe, PipeTransform } from '@angular/core';
import { BaselineFiltersType, FilterType, GeographicFiltersType, ListFiltersType, SbasFiltersType, TimeseriesFiltersType } from '@models';

@Pipe({
    name: 'baselineFilter'
})
export class BaselineFilterPipe implements PipeTransform {
    transform(input: FilterType): BaselineFiltersType {
        return input as BaselineFiltersType;
    }
}

@Pipe({
  name: 'SBASFilter'
})
export class SBASFilterPipe implements PipeTransform {
  transform(input: FilterType): SbasFiltersType {
      return input as SbasFiltersType;
  }
}

@Pipe({
  name: 'TimeseriesFilter'
})
export class TimeseriesFilterPipe implements PipeTransform {
  transform(input: FilterType): TimeseriesFiltersType {
      return input as TimeseriesFiltersType;
  }
}
@Pipe({
  name: 'geographicFilter'
})
export class GeographicFilterPipe implements PipeTransform {
  transform(input: FilterType): GeographicFiltersType {
      return input as GeographicFiltersType;
  }
}

@Pipe({
  name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {
  transform(input: FilterType): ListFiltersType {
      return input as ListFiltersType;
  }
}

