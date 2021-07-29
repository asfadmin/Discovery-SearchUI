import { SearchType } from './search-type.model';
import { FilterType } from './search.model';

export interface SavedFilterPreset {
  name: string;
  id: string;
  searchType: SearchType;
  filters: FilterType;
}
