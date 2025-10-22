import { Pipe, PipeTransform } from '@angular/core';
import {
  BaselineFiltersType,
  FilterType,
  GeographicFiltersType,
  ListFiltersType,
  SbasFiltersType,
  TimeseriesFiltersType,
  DisplacementFiltersType,
} from '@models';

@Pipe({
    name: 'baselineFilter',
    standalone: false
})
export class BaselineFilterPipe implements PipeTransform {
  transform(input: FilterType): BaselineFiltersType {
    return input as BaselineFiltersType;
  }
}

@Pipe({
    name: 'SBASFilter',
    standalone: false
})
export class SBASFilterPipe implements PipeTransform {
  transform(input: FilterType): SbasFiltersType {
    return input as SbasFiltersType;
  }
}

@Pipe({
    name: 'TimeseriesFilter',
    standalone: false
})
export class TimeseriesFilterPipe implements PipeTransform {
  transform(input: FilterType): TimeseriesFiltersType {
    return input as TimeseriesFiltersType;
  }
}
@Pipe({
    name: 'geographicFilter',
    standalone: false
})
export class GeographicFilterPipe implements PipeTransform {
  transform(input: FilterType): GeographicFiltersType {
    return input as GeographicFiltersType;
  }
}

@Pipe({
    name: 'listFilter',
    standalone: false
})
export class ListFilterPipe implements PipeTransform {
  transform(input: FilterType): ListFiltersType {
    return input as ListFiltersType;
  }
}
@Pipe({
    name: 'displacementFilter',
    standalone: false
})
export class DisplacementFilterPipe implements PipeTransform {
  transform(input: FilterType): DisplacementFiltersType {
    return input as DisplacementFiltersType;
  }
}
