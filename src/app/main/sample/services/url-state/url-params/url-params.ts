import { UrlParameter } from './url-param';

import { IsFilterMenuOpen, SelectedFilter } from './ui-params';
import { SelectedPlatforms } from './filter-params';
import { View, MapZoom, MapCenter } from './map-params';


export const urlParameters: {[id: string]: UrlParameter} = {
  isFiltersMenuOpen: new IsFilterMenuOpen(),
  selectedFilter: new SelectedFilter(),
  selectedPlatforms: new SelectedPlatforms(),
  view: new View(),
  mapZoom: new MapZoom(),
  mapCenter: new MapCenter(),
};
