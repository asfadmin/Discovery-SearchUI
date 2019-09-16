import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import * as models from '@models';


export interface FiltersState {
  datasets: DatasetsState;

  dateRange: DateRangeState;

  pathRange: models.Range<number | null>;
  frameRange: models.Range<number | null>;
  season: models.Range<number | null>;
  shouldOmitSearchPolygon: boolean;

  listSearchMode: models.ListSearchType;
  searchList: string[];

  productTypes: models.DatasetProductTypes;
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  flightDirections: Set<models.FlightDirection>;
  subtypes: models.DatasetSubtypes;

  missions: {[dataset: string]: string};
  selectedMission: null | string;

  maxResults: number;
}


export type DateRangeState = models.Range<null | Date>;


export interface DatasetsState {
  entities: {[id: string]: models.Dataset };
  selected: string;
}

export const initState: FiltersState = {
  datasets: {
    entities: models.datasets.reduce(
      (datasetsObj, dataset) => {
        datasetsObj[dataset.id] = dataset;

        return datasetsObj;
      },
      {}
    ),
    selected: 'SENTINEL-1'
  },
  dateRange: {
    start: null,
    end: null
  },
  season: {
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
  searchList: [],

  productTypes: [],
  beamModes: [],
  polarizations: [],
  subtypes: [],
  flightDirections: new Set<models.FlightDirection>([]),

  missions: {},
  selectedMission:  null,

  maxResults: 250,
};


export function filtersReducer(state = initState, action: FiltersActions): FiltersState {
  switch (action.type) {
    case FiltersActionType.SET_STATE: {
      return {
        ...state,
        ...action.payload
      };
    }

    case FiltersActionType.SET_SELECTED_DATASET: {
      const selected = action.payload.toUpperCase();

      return {
        ...state,
        datasets: {
          ...state.datasets,
          selected
        },
        productTypes: [],
        beamModes: [],
        polarizations: [],
        subtypes: [],
      };
    }

    case FiltersActionType.SET_START_DATE: {
      const start = action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange, start
        }
      };
    }

    case FiltersActionType.SET_END_DATE: {
      const end = action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange, end
        }
      };
    }

    case FiltersActionType.SET_SEASON_START: {
      return {
        ...state,
        season: {
          ...state.season,
          start: action.payload
        }
      };
    }

    case FiltersActionType.SET_SEASON_END: {
      return {
        ...state,
        season: {
          ...state.season,
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

    case FiltersActionType.CLEAR_SEASON: {
      return {
        ...state,
        season: initState.season
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

    case FiltersActionType.CLEAR_DATASET_FILTERS: {
      return {
        ...state,
        dateRange: {
          start: null,
          end: null
        },
        season: {
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

        productTypes: [],
        beamModes: [],
        polarizations: [],
        subtypes: [],
        flightDirections: new Set<models.FlightDirection>([]),
        selectedMission: null,
      };
    }

    case FiltersActionType.CLEAR_LIST_FILTERS: {
      return {
        ...state,
        searchList: []
      };
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

    case FiltersActionType.SET_PRODUCT_TYPES: {
      return {
        ...state,
        productTypes: [ ...action.payload ]
      };
    }

    case FiltersActionType.ADD_BEAM_MODE: {
      return {
        ...state,
        beamModes: [ ...state.beamModes, action.payload ]
      };
    }

    case FiltersActionType.SET_BEAM_MODES: {
      return {
        ...state,
        beamModes: [ ...action.payload ]
      };
    }

    case FiltersActionType.ADD_POLARIZATION: {
      const newPols = Array.from(
        new Set([...state.polarizations, action.payload])
      );

      return {
        ...state,
        polarizations: [ ...newPols ]
      };
    }

    case FiltersActionType.SET_POLARIZATIONS: {
      return {
        ...state,
        polarizations: [ ...action.payload ]
      };
    }

    case FiltersActionType.ADD_SUBTYPE: {
      const newPols = Array.from(
        new Set([...state.subtypes, action.payload])
      );

      return {
        ...state,
        subtypes: [ ...newPols ]
      };
    }

    case FiltersActionType.SET_SUBTYPES: {
      return {
        ...state,
        subtypes: [ ...action.payload ]
      };
    }

    case FiltersActionType.ADD_FLIGHT_DIRECTION: {
      return {
        ...state,
        flightDirections: new Set([action.payload, ...Array.from(state.flightDirections)])
      };
    }

    case FiltersActionType.SET_FLIGHT_DIRECTIONS: {
      return {
        ...state,
        flightDirections: new Set(action.payload)
      };
    }

    case FiltersActionType.SET_MISSIONS: {
      console.log(action.payload);
      return {
        ...state,
        missions: action.payload
      };
    }

    case FiltersActionType.SELECT_MISSION: {
      return {
        ...state,
        selectedMission: action.payload
      };
    }

    case FiltersActionType.CLEAR_SELECTED_MISSION: {
      return {
        ...state,
        selectedMission: null
      };
    }

    case FiltersActionType.SET_MAX_RESULTS: {
      return {
        ...state,
        maxResults: action.payload,
      };
    }

    case FiltersActionType.SET_SEARCH_LIST: {
      return {
        ...state,
        searchList: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getDatasetsState = createSelector(
  getFiltersState,
  (state: FiltersState) => state.datasets
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

export const getSeason = createSelector(
  getFiltersState,
  (state: FiltersState) => state.season
);

export const getSeasonStart = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.start
);

export const getSeasonEnd = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.end
);

export const getDatasetsList = createSelector(
  getDatasetsState ,
  (state: DatasetsState) => Object.values(state.entities)
);


export const getSelectedDatasetId = createSelector(
  getDatasetsState ,
  ({ selected }) => selected
);

export const getSelectedDataset = createSelector(
  getDatasetsState ,
  (state: DatasetsState) => state.entities[state.selected]
);

export const getPathRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.pathRange
);

export const getFrameRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.frameRange
);

export const getPathFrameRanges = createSelector(
  getFiltersState,
  ({ frameRange, pathRange }) => ({ frameRange, pathRange })
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

export const getSubtypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.subtypes
);

export const getFlightDirections = createSelector(
  getFiltersState,
  (state: FiltersState) => Array.from(state.flightDirections)
);

export const getMissionsByDataset = createSelector(
  getFiltersState,
  (state: FiltersState) => state.missions
);

export const getSelectedMission = createSelector(
  getFiltersState,
  (state: FiltersState) => state.selectedMission
);

export const getMaxSearchResults = createSelector(
  getFiltersState,
  (state: FiltersState) => state.maxResults
);

export const getSearchList = createSelector(
  getFiltersState,
  (state: FiltersState) => state.searchList
);
