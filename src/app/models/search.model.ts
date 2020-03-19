import { SearchType } from './search-type.model';
import { ListSearchType } from './filter-types.model';
import { Range } from './range.model';
import { FlightDirection } from './cmr-product.model';
import * as fromDatasets from './dataset.model';


export interface Search {
  searchType: SearchType;
  name: string;
  id: string;
  filters: FilterType;
}

export type FilterType =
  ListFiltersType |
  GeographicFiltersType |
  BaselineFiltersType;

export interface ListFiltersType {
  listType: ListSearchType;
  list: string[];
}

export interface BaselineFiltersType {
  filterMaster: string | null;
  master: string | null;

  dateRange: Range<null | Date>;
  season: Range<number | null>;

  temporalRange: Range<number | null>;
  perpendicularRange: Range<number | null>;
}

export interface GeographicFiltersType {
  selectedDataset: string;
  maxResults: number;

  polygon: string;
  dateRange: Range<null | Date>;

  pathRange: Range<number | null>;
  frameRange: Range<number | null>;
  season: Range<number | null>;

  productTypes: fromDatasets.DatasetProductTypes;
  beamModes: fromDatasets.DatasetBeamModes;
  polarizations: fromDatasets.DatasetPolarizations;
  flightDirections: FlightDirection[];
  subtypes: fromDatasets.DatasetSubtypes;

  selectedMission: null | string;
}

