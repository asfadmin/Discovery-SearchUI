import { SearchType } from './search-type.model';
import { ListSearchType } from './filter-types.model';
import { Range } from './range.model';
import { FlightDirection } from './cmr-product.model';
import * as fromDatasets from './dataset.model';
import { Hyp3JobStatusCode } from './hyp3';
import {
  SarviewsEventType,
  SBASOverlap,
  timeseriesChartItemState,
} from '@models';

export interface Search {
  searchType: SearchType;
  name: string;
  id: string;
  filters: FilterType;
}

export type FilterType =
  | ListFiltersType
  | GeographicFiltersType
  | BaselineFiltersType
  | CustomProductFiltersType
  | SbasFiltersType
  | TimeseriesFiltersType
  | SarviewsFiltersType
  | DisplacementFiltersType;

export interface ListFiltersType {
  listType: ListSearchType;
  list: string[];
}

export interface BaselineFiltersType {
  filterMaster: string | null;
  reference: string | null;

  dateRange: Range<null | Date>;

  season: Range<number | null>;
  temporalRange: Range<number | null>;
  perpendicularRange: Range<number | null>;
}

export interface SbasFiltersType {
  reference: string | null;

  dateRange: Range<null | Date>;

  season: Range<number | null>;
  temporalRange: Range<number | null>;
  perpendicular: Range<number | null>;
  customPairIds: string[][];

  thresholdOverlap: SBASOverlap;
}

export interface CustomProductFiltersType {
  jobStatuses: Hyp3JobStatusCode[];

  dateRange: Range<null | Date>;

  projectName: string;
  productFilterName: string;
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

  fullBurstIDs: string[];
  operaBurstIDs: string[];
  useCalibrationData: boolean;
  // shortNames: state.shortNames,
  // sciProducts: state.scienceProduct,
  // productConfig: state.productionConfig,
  // sidePolarizations : state.sidePolarizations,
  // frameCoverage: state.frameCoverage,
  // jointObservation: state.jointObservation,
  shortNames: fromDatasets.DatasetShortName;
  scienceProduct: string[];
  productionConfig: string[];
  sidePolarizations: fromDatasets.DatasetPolarizations;
  frameCoverage: string[];
  jointObservation: boolean;
  rangeBandwidth: string[];
  instrument: string[];
  groupID: null | string;
  granuleList: null | string;
  tileID?: null | string;

  ariaVersion?: string;
}

export interface SarviewsFiltersType {
  sarviewsEventTypes: SarviewsEventType[];

  pathRange: Range<number | null>;
  frameRange: Range<number | null>;
  hyp3ProductTypes: string[];
  // season: Range<number | null>;
  dateRange: Range<null | Date>;
  magnitude: Range<null | number>;
  activeOnly: boolean;
  sarviewsEventNameFilter: string;
  pinnedProductIDs: string[];
  selectedEventID: string;
}

export interface DisplacementFiltersType {
  seriesStates: Record<string, timeseriesChartItemState>;
  flightDirections: FlightDirection[];
  dateRange: Range<null | Date>;
}
export interface TimeseriesFiltersType {
  fullBurstIDs: string[];
}
export interface SearchRedirect {
  searchType: SearchType;
  filters: {
    selectedDataset: string;
    productTypes: fromDatasets.ProductType[];
  };
}
