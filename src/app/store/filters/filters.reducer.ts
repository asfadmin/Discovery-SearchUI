import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import * as models from '@models';


export interface FiltersState {
  platforms: PlatformsState;

  dateRange: DateRangeState;

  pathRange: models.Range<number | null>;
  frameRange: models.Range<number | null>;
  shouldOmitSearchPolygon: boolean;

  listSearchMode: models.ListSearchType;

  productTypes: models.PlatformProductTypes;
  beamModes: models.PlatformBeamModes;
  polarizations: models.PlatformPolarizations;
  flightDirections: Set<models.FlightDirection>;
}

export type DateRangeState = models.Range<null | Date>;

export interface PlatformsState {
  entities: {[id: string]: models.Platform };
  selected: Set<string>;
}

const initState: FiltersState = {
  platforms: {
    entities: models.platforms.reduce(
      (platformsObj, platform) => {
        platformsObj[platform.name] = platform;

        return platformsObj;
      },
      {}
    ),
    selected: new Set<string>(['Sentinel-1A', 'Sentinel-1B'])
  },
  dateRange: {
    start: null,
    end: null
  },
  pathRange: {
    start: null,
    end: null
  },
  frameRange: {
    start: null,
    end: null
  },
  shouldOmitSearchPolygon: false,
  listSearchMode: models.ListSearchType.GRANULE,

  productTypes: {},
  beamModes: {},
  polarizations: {},
  flightDirections: new Set<models.FlightDirection>([]),
};


export function filtersReducer(state = initState, action: FiltersActions): FiltersState {
  switch (action.type) {
    case FiltersActionType.ADD_SELECTED_PLATFORM: {
      const selected = new Set<string>(state.platforms.selected);
      selected.add(action.payload);
      console.log('selected', selected);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        }
      };
    }

    case FiltersActionType.REMOVE_SELECTED_PLATFORM: {
      const selected = new Set<string>(state.platforms.selected);
      selected.delete(action.payload);
      console.log('selected', selected);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        },
        productTypes: {
          ...state.productTypes,
          [action.payload]: []
        },
        beamModes: {
          ...state.beamModes,
          [action.payload]: []
        }
      };
    }

    case FiltersActionType.SET_SELECTED_PLATFORMS: {
      const selected = new Set(action.payload);

      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected
        }
      };
    }

    case FiltersActionType.SET_START_DATE: {
      return {
        ...state,
        dateRange: {
          ...state.dateRange,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_END_DATE: {
      return {
        ...state,
        dateRange: {
          ...state.dateRange,
          end: action.payload
        }
      };
    }

    case FiltersActionType.CLEAR_DATE_RANGE: {
      return {
        ...state,
        dateRange: initState.dateRange
      };
    }

    case FiltersActionType.SET_PATH_START: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_PATH_END: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          end: action.payload
        }
      };
    }

    case FiltersActionType.SET_FRAME_START: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_FRAME_END: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          end: action.payload
        }
      };
    }

    case FiltersActionType.CLEAR_FILTERS: {
      return initState;
    }

    case FiltersActionType.USE_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: false };
    }

    case FiltersActionType.OMIT_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: true };
    }

    case FiltersActionType.SET_LIST_SEARCH_TYPE: {
      return {
        ...state,
        listSearchMode: action.payload
      };
    }

    case FiltersActionType.ADD_PRODUCT_TYPE: {
      const productTypes = { ...state.productTypes };
      const oldTypes = productTypes[action.payload.platform] || [];

      productTypes[action.payload.platform] = [
        ...oldTypes, action.payload.productType
      ];

      return {
        ...state,
        productTypes
      };
    }

    case FiltersActionType.SET_PRODUCT_TYPES: {
      return {
        ...state,
        productTypes: action.payload
      };
    }

    case FiltersActionType.REMOVE_PRODUCT_TYPE: {
      const productTypes = { ...state.productTypes };

      const types = [...productTypes[action.payload.platform]]
        .filter(productType => productType !== action.payload.productType);

      productTypes[action.payload.platform] = types;

      return {
        ...state,
        productTypes
      };
    }

    case FiltersActionType.SET_PLATFORM_BEAM_MODES: {
      return {
        ...state,
        beamModes: { ...state.beamModes, ...action.payload }
      };
    }

    case FiltersActionType.SET_ALL_BEAM_MODES: {
      return {
        ...state,
        beamModes: { ...action.payload }
      };
    }

    case FiltersActionType.SET_PLATFORM_POLARIZATIONS: {
      return {
        ...state,
        polarizations: { ...state.polarizations, ...action.payload }
      };
    }

    case FiltersActionType.SET_ALL_POLARIZATIONS: {
      return {
        ...state,
        polarizations: { ...action.payload }
      };
    }

    case FiltersActionType.SET_FLIGHT_DIRECTIONS: {
      return {
        ...state,
        flightDirections: new Set(action.payload)
      };
    }

    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getPlatforms = createSelector(
  getFiltersState,
  (state: FiltersState) => state.platforms
);

export const getDateRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.dateRange
);

export const getStartDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.start
);

export const getEndDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.end
);

export const getPlatformsList = createSelector(
  getPlatforms,
  (state: PlatformsState) => Object.values(state.entities)
);


export const getSelectedPlatformNames = createSelector(
  getPlatforms,
  (state: PlatformsState) => state.selected
);

export const getSelectedPlatforms = createSelector(
  getPlatforms,
  (state: PlatformsState) => Array.from(state.selected).reduce(
    (selected: models.Platform[], name: string) => [...selected, state.entities[name]],
    []
  )
);

export const getPathRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.pathRange
);

export const getFrameRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.frameRange
);

export const getShouldOmitSearchPolygon = createSelector(
  getFiltersState,
  (state: FiltersState) => state.shouldOmitSearchPolygon
);

export const getListSearchMode = createSelector(
  getFiltersState,
  (state: FiltersState) => state.listSearchMode
);

export const getProductTypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.productTypes
);

export const getBeamModes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.beamModes
);

export const getPolarizations = createSelector(
  getFiltersState,
  (state: FiltersState) => state.polarizations
);

export const getFlightDirections = createSelector(
  getFiltersState,
  (state: FiltersState) => Array.from(state.flightDirections)
);
