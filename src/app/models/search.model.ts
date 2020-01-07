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
  GeographicFiltersType;

export interface ListFiltersType {
  listType: ListSearchType;
  list: string[];
}

export interface GeographicFiltersType {
  selectedDataset: string;
  maxResults: number;

  dateRange: Range<null | Date>;

  pathRange: Range<number | null>;
  frameRange: Range<number | null>;
  season: Range<number | null>;

  productTypes: fromDatasets.DatasetProductTypes;
  beamModes: fromDatasets.DatasetBeamModes;
  polarizations: fromDatasets.DatasetPolarizations;
  flightDirections: Set<FlightDirection>;
  subtypes: fromDatasets.DatasetSubtypes;

  selectedMission: null | string;
}

