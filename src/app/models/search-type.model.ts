export enum SearchType {
  DATASET = 'Geographic Search',
  LIST = 'List Search',
  BASELINE = 'Baseline Search',
  SBAS = 'SBAS Search',
  CUSTOM_PRODUCTS = 'Custom Products',
  SARVIEWS_EVENTS = 'SARViews Event Search',
}

export const SearchTypes = Object.keys(SearchType);
