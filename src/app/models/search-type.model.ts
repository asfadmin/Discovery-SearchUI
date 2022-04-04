export enum SearchType {
  DATASET = 'Geographic Search',
  LIST = 'List Search',
  BASELINE = 'Baseline Search',
  SBAS = 'SBAS Search',
  CUSTOM_PRODUCTS = 'Custom Products',
  SARVIEWS_EVENTS = 'Event Search',
  DERIVED_DATASETS = 'Derived Datasets',
}

export const SearchTypes = Object.keys(SearchType);
