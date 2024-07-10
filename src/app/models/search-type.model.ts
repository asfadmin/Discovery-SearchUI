export enum SearchType {
  DATASET = 'Geographic Search',
  LIST = 'List Search',
  BASELINE = 'Baseline Search',
  SBAS = 'SBAS Search',
  CUSTOM_PRODUCTS = 'On Demand',
  TIMESERIES = 'TIMESERIES',
  SARVIEWS_EVENTS = 'Event Search',
  DERIVED_DATASETS = 'Derived Datasets',
}

export const SearchTypeTranslation = {
  'Geographic Search' : 'GEOGRAPHIC_SEARCH',
  'List Search' : 'LIST_SEARCH',
  'Baseline Search' : 'BASELINE_SEARCH',
  'Timeseries Tool' : 'TIMESERIES_TOOL',
  'SBAS Search' : 'SBAS_SEARCH',
  'On Demand' : 'ON_DEMAND',
  'Event Search' : 'EVENT_SEARCH',
  'Derived Datasets' : 'DERIVED_DATASETS'
}

export enum IconType {
  MATERIAL = 'MATERIAL',
  IMAGE = 'IMAGE'
}

export interface SearchTypeSelector {
  searchType: SearchType;
  nameKey: string;
  descriptionKeys: string[];
  helpUrl: string;
  icon: string;
  iconType: IconType;
}

export const SearchTypes = Object.keys(SearchType);
