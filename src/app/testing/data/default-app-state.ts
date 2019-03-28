import { AppState } from '@store';
import * as granuleStore from '@store/granules';
import * as mapStore from '@store/map';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';
import * as missionStore from '@store/mission';

export const defaultAppState: AppState = {
  granules: granuleStore.initState,
  map: mapStore.initState,
  filters: filtersStore.initState,
  ui: uiStore.initState,
  search: searchStore.initState,
  queue: queueStore.initState ,
  mission: missionStore.initState,
};
