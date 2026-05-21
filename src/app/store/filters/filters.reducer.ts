import { createFeatureSelector, createSelector } from '@ngrx/store';

import { FiltersActionType, FiltersActions } from './filters.action';
import * as models from '@models';
import {
  EventProductSort,
  EventProductSortDirection,
  EventProductSortType,
  hyp3JobTypes,
  SBASOverlap,
} from '@models';
import { createSimpleArraySelector } from '../selectors';

export interface FiltersState {
  selectedDatasetId: string;

  dateRange: DateRangeState;
  perpendicularRange: models.Range<number | null>;
  temporalRange: models.Range<number | null>;

  pathRange: models.Range<number | null>;
  frameRange: models.Range<number | null>;
  season: models.Range<number | null>;
  shouldOmitSearchPolygon: boolean;

  listSearchMode: models.ListSearchType;
  searchList: string[];

  productTypes: models.DatasetProductTypes;
  shortNames: models.DatasetShortName;
  beamModes: models.DatasetBeamModes;
  polarizations: models.DatasetPolarizations;
  sidePolarizations: models.DatasetPolarizations;
  flightDirections: Set<models.FlightDirection>;
  subtypes: models.DatasetSubtypes;
  jobStatuses: models.Hyp3JobStatusCode[];

  missions: Record<string, string[]>;
  selectedMission: null | string;

  maxResults: number;
  projectName: string;
  productFilterName: string;

  previousFilters: FiltersState;

  thresholdOverlap: boolean;
  sbasOverlapThreshold: SBASOverlap;

  sarviewsEventTypes: models.SarviewsEventType[];
  sarviewsEventNameFilter: string;
  sarviewsEventActiveOnly: boolean;
  sarviewsMagnitudeRange: models.Range<number>;

  hyp3ProductTypes: string[];
  sarviewsEventProductSorting: EventProductSort;

  geocode: null | string;

  fullBurstIDs: null | string[];

  frameCoverage: string[];
  jointObservation: boolean;
  rangeBandwidth: string[];
  instrument: string[];
  scienceProduct: string[];
  productionConfig: string[];

  operaBurstIDs: null | string[];
  useCalibrationData: boolean; // used to toggle OPERA-S1 Calval (calibration) datasets

  groupID: null | string;
  tileID: null | string;

  useFramesForReference: boolean;
  granuleList: null | string;
  ariaVersion: string;
}

export type DateRangeState = models.Range<null | Date>;

export const initState: FiltersState = {
  selectedDatasetId: 'NISAR',
  dateRange: {
    start: null,
    end: null,
  },
  perpendicularRange: {
    start: null,
    end: null,
  },
  temporalRange: {
    start: null,
    end: null,
  },
  season: {
    start: null,
    end: null,
  },
  pathRange: {
    start: null,
    end: null,
  },
  frameRange: {
    start: null,
    end: null,
  },
  shouldOmitSearchPolygon: false,
  listSearchMode: models.ListSearchType.SCENE,
  searchList: [],

  productTypes: [],
  beamModes: [],
  polarizations: [],
  sidePolarizations: [],
  subtypes: [],
  flightDirections: new Set<models.FlightDirection>([]),
  jobStatuses: [],

  missions: {},
  selectedMission: null,

  maxResults: 250,
  projectName: null,
  productFilterName: null,

  previousFilters: null,

  thresholdOverlap: false,
  sbasOverlapThreshold: SBASOverlap.HALF_OVERLAP,

  sarviewsEventTypes: [],
  sarviewsEventNameFilter: null,
  sarviewsEventActiveOnly: false,
  sarviewsMagnitudeRange: {
    start: null,
    end: null,
  },
  sarviewsEventProductSorting: {
    sortType: EventProductSortType.DATE,
    sortDirection: EventProductSortDirection.DESCENDING,
  },
  hyp3ProductTypes: [],

  geocode: null,

  fullBurstIDs: [],

  operaBurstIDs: [],
  useCalibrationData: false,

  frameCoverage: [],
  jointObservation: false,
  rangeBandwidth: [],
  instrument: [],
  scienceProduct: [],
  productionConfig: [],

  groupID: null,
  tileID: null,
  shortNames: [],

  granuleList: null,

  useFramesForReference: false,
  ariaVersion: null,
};

export function filtersReducer(
  state = initState,
  action: FiltersActions,
): FiltersState {
  switch (action.type) {
    case FiltersActionType.SET_SELECTED_DATASET: {
      if (!action.payload) {
        return state;
      }

      const selected = action.payload.toUpperCase();

      return {
        ...state,
        selectedDatasetId: selected,
        productTypes: [],
        beamModes: [],
        polarizations: [],
        subtypes: [],
        fullBurstIDs: [],
        operaBurstIDs: [],

        frameCoverage: [],
        jointObservation: null,
        rangeBandwidth: [],
        instrument: [],
        scienceProduct: [],
        productionConfig: [],
        sidePolarizations: [],
        flightDirections: new Set<models.FlightDirection>([]),

        groupID: null,
        granuleList: null,
        tileID: null,
        shortNames: [],
        useCalibrationData: false,
        selectedMission: null,
        ariaVersion: null,
      };
    }

    case FiltersActionType.SET_START_DATE: {
      const start = action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange,
          start,
        },
      };
    }

    case FiltersActionType.SET_END_DATE: {
      const end = action.payload;

      return {
        ...state,
        dateRange: {
          ...state.dateRange,
          end,
        },
      };
    }

    case FiltersActionType.SET_TEMPORAL_START: {
      const start = action.payload;

      return {
        ...state,
        temporalRange: {
          ...state.temporalRange,
          start,
        },
      };
    }

    case FiltersActionType.SET_TEMPORAL_END: {
      const end = action.payload;

      return {
        ...state,
        temporalRange: {
          ...state.temporalRange,
          end,
        },
      };
    }

    case FiltersActionType.SET_TEMPORAL_RANGE: {
      return {
        ...state,
        // temporalRange: action.payload
        temporalRange: action.payload,
      };
    }

    case FiltersActionType.CLEAR_PERPENDICULAR_RANGE: {
      return {
        ...state,
        perpendicularRange: {
          start: null,
          end: null,
        },
      };
    }

    case FiltersActionType.SET_PERPENDICULAR_END: {
      const end = action.payload;

      return {
        ...state,
        perpendicularRange: {
          ...state.perpendicularRange,
          end,
        },
      };
    }

    case FiltersActionType.SET_PERPENDICULAR_START: {
      const start = action.payload;

      return {
        ...state,
        perpendicularRange: {
          ...state.perpendicularRange,
          start,
        },
      };
    }

    case FiltersActionType.SET_PERPENDICULAR_RANGE: {
      return {
        ...state,
        perpendicularRange: action.payload,
      };
    }

    case FiltersActionType.CLEAR_TEMPORAL_RANGE: {
      return {
        ...state,
        temporalRange: {
          start: null,
          end: null,
        },
      };
    }

    case FiltersActionType.SET_SEASON_START: {
      return {
        ...state,
        season: {
          ...state.season,
          start: action.payload,
        },
      };
    }

    case FiltersActionType.SET_SEASON_END: {
      return {
        ...state,
        season: {
          ...state.season,
          end: action.payload,
        },
      };
    }

    case FiltersActionType.CLEAR_DATE_RANGE: {
      return {
        ...state,
        dateRange: initState.dateRange,
      };
    }

    case FiltersActionType.CLEAR_SEASON: {
      return {
        ...state,
        season: initState.season,
      };
    }

    case FiltersActionType.SET_PATH_START: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          start: action.payload,
        },
      };
    }

    case FiltersActionType.SET_PATH_END: {
      return {
        ...state,
        pathRange: {
          ...state.pathRange,
          end: action.payload,
        },
      };
    }

    case FiltersActionType.CLEAR_PATH_RANGE: {
      return {
        ...state,
        pathRange: {
          start: null,
          end: null,
        },
      };
    }

    case FiltersActionType.SET_FRAME_START: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          start: action.payload,
        },
      };
    }

    case FiltersActionType.SET_FRAME_END: {
      return {
        ...state,
        frameRange: {
          ...state.frameRange,
          end: action.payload,
        },
      };
    }

    case FiltersActionType.SET_FILTERS_SIMILAR_TO: {
      const metadata = action.payload.product.metadata;
      let filters: any = {
        frameRange: {
          start: metadata.frame,
          end: metadata.frame,
        },
        pathRange: {
          start: metadata.path,
          end: metadata.path,
        },
        selectedMission: metadata.missionName,
        selectedDatasetId: action.payload.dataset.id ?? 'SENTINEL-1',
      };

      if (action.payload.dataset.id === models.sentinel_1_bursts.id) {
        filters = {
          fullBurstIDs: [metadata.burst.fullBurstID],
        };
      }
      if (action.payload.dataset.id === models.opera_s1.id) {
        filters = {
          groupID: action.payload.product.groupId,
          selectedDatasetId: 'SENTINEL-1',
        };
      }
      return {
        ...state,
        ...filters,
      };
    }

    case FiltersActionType.CLEAR_FRAME_RANGE: {
      return {
        ...state,
        frameRange: {
          start: null,
          end: null,
        },
      };
    }

    case FiltersActionType.CLEAR_DATASET_FILTERS: {
      return {
        ...state,
        dateRange: {
          start: null,
          end: null,
        },
        season: {
          start: null,
          end: null,
        },
        pathRange: {
          start: null,
          end: null,
        },
        frameRange: {
          start: null,
          end: null,
        },
        shouldOmitSearchPolygon: false,

        productTypes: [],
        beamModes: [],
        polarizations: [],
        subtypes: [],
        flightDirections: new Set<models.FlightDirection>([]),
        selectedMission: null,
        geocode: null,
        fullBurstIDs: [],
        operaBurstIDs: [],
        useCalibrationData: false,
        groupID: null,
        tileID: null,
        shortNames: [],
        frameCoverage: [],
        sidePolarizations: [],
        jointObservation: false,
        granuleList: null,
        instrument: [],
        rangeBandwidth: [],
        scienceProduct: [],
        productionConfig: [],
        ariaVersion: null,
      };
    }

    case FiltersActionType.CLEAR_LIST_FILTERS: {
      return {
        ...state,
        searchList: [],
      };
    }

    case FiltersActionType.CLEAR_EVENT_FILTERS: {
      return {
        ...state,
        sarviewsMagnitudeRange: initState.sarviewsMagnitudeRange,
        sarviewsEventActiveOnly: false,
        sarviewsEventTypes: [],
        hyp3ProductTypes: [],
      };
    }

    case FiltersActionType.USE_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: false };
    }

    case FiltersActionType.APPLY_DATASET_DEFAULTS: {
      return {
        ...state,
        ...action.payload,
      };
    }

    case FiltersActionType.OMIT_SEARCH_POLYGON: {
      return { ...state, shouldOmitSearchPolygon: true };
    }

    case FiltersActionType.SET_LIST_SEARCH_TYPE: {
      return {
        ...state,
        listSearchMode: action.payload,
      };
    }

    case FiltersActionType.SET_PRODUCT_TYPES: {
      return {
        ...state,
        productTypes: [...action.payload],
      };
    }

    case FiltersActionType.SET_SHORT_NAMES: {
      return {
        ...state,
        shortNames: [...action.payload],
      };
    }

    case FiltersActionType.ADD_BEAM_MODE: {
      return {
        ...state,
        beamModes: [...state.beamModes, action.payload],
      };
    }
    case FiltersActionType.ADD_RANGE_BANDWIDTH: {
      return {
        ...state,
        rangeBandwidth: [...new Set([...state.rangeBandwidth, action.payload])],
      };
    }

    case FiltersActionType.SET_BEAM_MODES: {
      return {
        ...state,
        beamModes: [...action.payload],
      };
    }

    case FiltersActionType.SET_JOB_STATUSES: {
      return {
        ...state,
        jobStatuses: [...action.payload],
      };
    }

    case FiltersActionType.ADD_POLARIZATION: {
      const newPols = Array.from(
        new Set([...state.polarizations, action.payload]),
      );

      return {
        ...state,
        polarizations: [...newPols],
      };
    }

    case FiltersActionType.SET_POLARIZATIONS: {
      return {
        ...state,
        polarizations: [...action.payload],
      };
    }
    case FiltersActionType.ADD_SIDE_POLARIZATION: {
      const newPols = Array.from(
        new Set([...state.sidePolarizations, action.payload]),
      );

      return {
        ...state,
        sidePolarizations: [...newPols],
      };
    }

    case FiltersActionType.SET_SIDE_POLARIZATIONS: {
      return {
        ...state,
        sidePolarizations: [...action.payload],
      };
    }
    case FiltersActionType.SET_SUBTYPES: {
      return {
        ...state,
        subtypes: [...action.payload],
      };
    }

    case FiltersActionType.SET_FLIGHT_DIRECTIONS: {
      return {
        ...state,
        flightDirections: new Set(action.payload),
      };
    }

    case FiltersActionType.SET_MISSIONS: {
      return {
        ...state,
        missions: action.payload,
      };
    }

    case FiltersActionType.SELECT_MISSION: {
      return {
        ...state,
        selectedMission: action.payload,
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
        searchList: action.payload,
      };
    }

    case FiltersActionType.SET_SAVED_SEARCH: {
      const search = action.payload;
      if (search.searchType === models.SearchType.LIST) {
        const filters = search.filters as models.ListFiltersType;

        return {
          ...state,
          listSearchMode: filters.listType,
          searchList: filters.list,
        };
      } else if (search.searchType === models.SearchType.BASELINE) {
        const filters = search.filters as models.BaselineFiltersType;

        return {
          ...state,
          dateRange: filters.dateRange,
          temporalRange: filters.temporalRange || {
            start: null,
            end: null,
          },
          perpendicularRange: filters.perpendicularRange || {
            start: null,
            end: null,
          },
          season: filters.season || {
            start: null,
            end: null,
          },
        };
      } else if (search.searchType === models.SearchType.SBAS) {
        const filters = search.filters as models.SbasFiltersType;

        return {
          ...state,
          dateRange: filters.dateRange,
          temporalRange: filters.temporalRange || {
            start: null,
            end: null,
          },
          perpendicularRange: filters.perpendicular || {
            start: null,
            end: null,
          },
          season: filters.season || {
            start: null,
            end: null,
          },
        };
      } else if (search.searchType === models.SearchType.CUSTOM_PRODUCTS) {
        const filters = search.filters as models.CustomProductFiltersType;

        return {
          ...state,
          jobStatuses: filters.jobStatuses || [],
          dateRange: filters.dateRange,
          projectName: filters.projectName,
          productFilterName: filters.productFilterName,
        };
      } else if (search.searchType === models.SearchType.SARVIEWS_EVENTS) {
        const filters = search.filters as models.SarviewsFiltersType;

        return {
          ...state,
          dateRange: filters.dateRange,
          sarviewsEventTypes: filters.sarviewsEventTypes || [],
          sarviewsEventNameFilter: filters.sarviewsEventNameFilter,
          sarviewsEventActiveOnly: filters.activeOnly,
          sarviewsMagnitudeRange: filters.magnitude || {
            start: null,
            end: null,
          },
          hyp3ProductTypes: filters.hyp3ProductTypes || [],
          pathRange: filters.pathRange || {
            start: null,
            end: null,
          },
          frameRange: filters.frameRange || {
            start: null,
            end: null,
          },
        };
      } else if (search.searchType === models.SearchType.DERIVED_DATASETS) {
        // TODO: Don't make geosearch default case or handle no
        // savable searches better
        return { ...state };
      } else if (search.searchType === models.SearchType.DISPLACEMENT) {
        const filters = search.filters as models.DisplacementFiltersType;

        return {
          ...state,
          flightDirections: new Set(filters.flightDirections || []),
          dateRange: filters.dateRange,
        };
      } else {
        const filters = search.filters as models.GeographicFiltersType;

        const dataset = models.datasetList.filter(
          (d) => d.id === filters.selectedDataset,
        )[0];

        const filterSubtypes = new Set(
          (filters.subtypes || []).map((t) => t.apiValue),
        );

        const subtypes = dataset.subtypes.filter((subtype) =>
          filterSubtypes.has(subtype.apiValue),
        );

        const filterProductTypes = new Set(
          (filters.productTypes || []).map((t) => t.apiValue),
        );

        const productTypes = dataset.productTypes.filter((productType) =>
          filterProductTypes.has(productType.apiValue),
        );

        return {
          ...state,
          selectedDatasetId: filters.selectedDataset,
          maxResults: filters.maxResults,
          dateRange: filters.dateRange,
          pathRange: filters.pathRange || {
            start: null,
            end: null,
          },
          frameRange: filters.frameRange || {
            start: null,
            end: null,
          },
          season: filters.season || {
            start: null,
            end: null,
          },
          productTypes,
          beamModes: filters.beamModes || [],
          polarizations: filters.polarizations || [],
          flightDirections: new Set(filters.flightDirections || []),
          subtypes,
          selectedMission: filters.selectedMission,
          fullBurstIDs: filters.fullBurstIDs || [],
          operaBurstIDs: filters.operaBurstIDs || [],
          useCalibrationData: filters.useCalibrationData,
          shortNames: filters.shortNames || [],
          scienceProduct: filters.scienceProduct || [],
          productionConfig: filters.productionConfig || [],
          sidePolarizations: filters.sidePolarizations || [],
          frameCoverage: filters.frameCoverage || [],
          jointObservation: filters.jointObservation,
          rangeBandwidth: filters.rangeBandwidth || [],
          instrument: filters.instrument || [],
          groupID: filters.groupID,
          tileID: filters.tileID,
          ariaVersion: filters.ariaVersion,
        };
      }
    }

    case FiltersActionType.SET_PROJECT_NAME: {
      return {
        ...state,
        projectName: action.payload,
      };
    }
    case FiltersActionType.SET_PRODUCT_NAME_FILTER: {
      return {
        ...state,
        productFilterName: action.payload,
      };
    }
    case FiltersActionType.STORE_CURRENT_FILTERS: {
      return {
        ...state,
        previousFilters: { ...state },
      };
    }
    case FiltersActionType.RESTORE_FILTERS: {
      if (state.previousFilters !== null) {
        return {
          ...state.previousFilters,
          previousFilters: null,
        };
      }
      return state;
    }
    case FiltersActionType.TOGGLE_50_PERCENT_OVERLAP: {
      return {
        ...state,
        thresholdOverlap: !state.thresholdOverlap,
      };
    }
    case FiltersActionType.SET_SBAS_OVERLAP_THRESHOLD: {
      return {
        ...state,
        sbasOverlapThreshold: action.payload,
      };
    }
    case FiltersActionType.SET_SARVIEWS_EVENT_TYPES: {
      return {
        ...state,
        sarviewsEventTypes: [...action.payload],
      };
    }
    case FiltersActionType.SET_SARVIEWS_EVENT_NAME_FILTER: {
      return {
        ...state,
        sarviewsEventNameFilter: action.payload,
      };
    }
    case FiltersActionType.SET_SARVIEWS_EVENT_ACTIVE_FILTER: {
      return {
        ...state,
        sarviewsEventActiveOnly: action.payload,
      };
    }
    case FiltersActionType.SET_SARVIEWS_MAGNITUDE_START: {
      return {
        ...state,
        sarviewsMagnitudeRange: {
          ...state.sarviewsMagnitudeRange,
          start: action.payload,
        },
      };
    }
    case FiltersActionType.SET_SARVIEWS_MAGNITUDE_END: {
      return {
        ...state,
        sarviewsMagnitudeRange: {
          ...state.sarviewsMagnitudeRange,
          end: action.payload,
        },
      };
    }
    case FiltersActionType.SET_SARVIEWS_MAGNITUDE_RANGE: {
      return {
        ...state,
        sarviewsMagnitudeRange: action.payload,
      };
    }
    case FiltersActionType.CLEAR_SARVIEWS_MAGNITUDE_RANGE: {
      return {
        ...state,
        sarviewsMagnitudeRange: initState.sarviewsMagnitudeRange,
      };
    }
    case FiltersActionType.SET_HYP3_PRODUCT_TYPES: {
      return {
        ...state,
        hyp3ProductTypes: [...action.payload],
      };
    }
    case FiltersActionType.SET_EVENT_PRODUCT_SORT: {
      return {
        ...state,
        sarviewsEventProductSorting: { ...action.payload },
      };
    }
    case FiltersActionType.SET_GEOCODE: {
      return {
        ...state,
        geocode: action.payload,
      };
    }
    case FiltersActionType.CLEAR_HYP3_PRODUCT_TYPES: {
      return {
        ...state,
        hyp3ProductTypes: [],
      };
    }
    case FiltersActionType.SET_FULL_BURST: {
      return {
        ...state,
        fullBurstIDs: action.payload,
      };
    }
    case FiltersActionType.SET_OPERA_BURST_ID: {
      return {
        ...state,
        operaBurstIDs: action.payload,
      };
    }
    case FiltersActionType.SET_INCLUDE_CALIBRATION_DATA: {
      return {
        ...state,
        useCalibrationData: action.payload,
      };
    }
    case FiltersActionType.SET_GROUP_ID: {
      return {
        ...state,
        groupID: action.payload,
      };
    }
    case FiltersActionType.SET_FRAME_COVERAGE: {
      return {
        ...state,
        frameCoverage: action.payload,
      };
    }
    case FiltersActionType.SET_JOINT_OBSERVATION: {
      return {
        ...state,
        jointObservation: action.payload,
      };
    }
    case FiltersActionType.SET_RANGE_BANDWIDTH: {
      return {
        ...state,
        rangeBandwidth: action.payload,
      };
    }
    case FiltersActionType.SET_INSTRUMENT: {
      return {
        ...state,
        instrument: action.payload,
      };
    }
    case FiltersActionType.SET_SCIENCE_PRODUCT: {
      return {
        ...state,
        scienceProduct: action.payload,
      };
    }
    case FiltersActionType.SET_PRODUCTION_CONFIG: {
      return {
        ...state,
        productionConfig: action.payload,
      };
    }
    case FiltersActionType.SET_USER_FRAME_FOR_BASELINE: {
      return {
        ...state,
        useFramesForReference: action.payload,
      };
    }
    case FiltersActionType.SET_ARIA_VERSION: {
      return {
        ...state,
        ariaVersion: action.payload,
      };
    }
    case FiltersActionType.SET_TILE_ID: {
      return {
        ...state,
        tileID: action.payload,
      };
    }
    case FiltersActionType.SET_GRANULE_LIST: {
      return {
        ...state,
        granuleList: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}

export const getFiltersState = createFeatureSelector<FiltersState>('filters');

export const getDateRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.dateRange,
);

export const getStartDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.start,
);

export const getEndDate = createSelector(
  getDateRange,
  (state: DateRangeState) => state.end,
);

export const getTemporalRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.temporalRange,
);

export const getTemporalStart = createSelector(
  getTemporalRange,
  (state: models.Range<number | null>) => state.start,
);

export const getTemporalEnd = createSelector(
  getTemporalRange,
  (state: models.Range<number | null>) => state.end,
);

export const getPerpendicularRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.perpendicularRange,
);

export const getPerpendicularStart = createSelector(
  getPerpendicularRange,
  (state: models.Range<number | null>) => state.start,
);

export const getPerpendicularEnd = createSelector(
  getPerpendicularRange,
  (state: models.Range<number | null>) => state.end,
);

export const getSeason = createSelector(
  getFiltersState,
  (state: FiltersState) => state.season,
);

export const getSeasonStart = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.start,
);

export const getSeasonEnd = createSelector(
  getSeason,
  (state: models.Range<number | null>) => state.end,
);

export const getSelectedDatasetId = createSelector(
  getFiltersState,
  ({ selectedDatasetId }) => selectedDatasetId,
);

export const getSelectedDataset = createSelector(
  getFiltersState,
  (state: FiltersState) => models.datasets[state.selectedDatasetId],
);

export const getPathRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.pathRange,
);

export const getFrameRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.frameRange,
);

export const getPathFrameRanges = createSelector(
  getFiltersState,
  ({ frameRange, pathRange }) => ({ frameRange, pathRange }),
);

export const getShouldOmitSearchPolygon = createSelector(
  getFiltersState,
  (state: FiltersState) => state.shouldOmitSearchPolygon,
);

export const getListSearchMode = createSelector(
  getFiltersState,
  (state: FiltersState) => state.listSearchMode,
);

export const getProductTypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.productTypes,
);

export const getShortNames = createSelector(
  getFiltersState,
  (state: FiltersState) => state.shortNames,
);

export const getBeamModes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.beamModes,
);

export const getPolarizations = createSelector(
  getFiltersState,
  (state: FiltersState) => state.polarizations,
);

export const getSidePolarizations = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sidePolarizations,
);

export const getSubtypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.subtypes,
);

export const getFlightDirections = createSimpleArraySelector(
  getFiltersState,
  (state: FiltersState): models.FlightDirection[] => [
    ...state.flightDirections,
  ],
);

export const getMissionsByDataset = createSelector(
  getFiltersState,
  (state: FiltersState) => state.missions,
);

export const getSelectedMission = createSelector(
  getFiltersState,
  (state: FiltersState) => state.selectedMission,
);

export const getMaxSearchResults = createSelector(
  getFiltersState,
  (state: FiltersState) => state.maxResults,
);

export const getSearchList = createSelector(
  getFiltersState,
  (state: FiltersState) => state.searchList,
);

export const getListSearch = createSelector(
  getFiltersState,
  (state: FiltersState): models.ListFiltersType => ({
    listType: state.listSearchMode,
    list: state.searchList,
  }),
);

export const getGeographicSearch = createSelector(
  getFiltersState,
  (state: FiltersState) => ({
    selectedDataset: state.selectedDatasetId,
    maxResults: state.maxResults,
    dateRange: state.dateRange,
    pathRange: state.pathRange,
    frameRange: state.frameRange,
    season: state.season,
    productTypes: state.productTypes,
    beamModes: state.beamModes,
    polarizations: state.polarizations,
    flightDirections: state.flightDirections,
    subtypes: state.subtypes,
    selectedMission: state.selectedMission,
    fullBurstIDs: state.fullBurstIDs,
    operaBurstIDs: state.operaBurstIDs,
    useCalibrationData: state.useCalibrationData,
    shortNames: state.shortNames,
    scienceProduct: state.scienceProduct,
    productionConfig: state.productionConfig,
    sidePolarizations: state.sidePolarizations,
    frameCoverage: state.frameCoverage,
    jointObservation: state.jointObservation,
    rangeBandwidth: state.rangeBandwidth,
    instrument: state.instrument,
    groupID: state.groupID,
    granuleList: state.granuleList,
    tileID: state.tileID,
    ariaVersion: state.ariaVersion,
  }),
);

export const getBaselineSearch = createSelector(
  getFiltersState,
  (state: FiltersState) => ({
    dateRange: state.dateRange,
    season: state.season,
    temporalRange: state.temporalRange,
    perpendicularRange: state.perpendicularRange,
  }),
);

export const getSbasSearch = createSelector(
  getFiltersState,
  (state: FiltersState) => ({
    temporalRange: state.temporalRange,
    dateRange: state.dateRange,
    season: state.season,
    perpendicular: state.perpendicularRange,
    thresholdOverlap: state.sbasOverlapThreshold,
  }),
);

export const getCustomProductSearch = createSelector(
  getFiltersState,
  (state: FiltersState) => ({
    dateRange: state.dateRange,
    jobStatuses: state.jobStatuses,

    projectName: state.projectName,
    productFilterName: state.productFilterName,
  }),
);

export const getProjectName = createSelector(
  getFiltersState,
  (state: FiltersState) => state.projectName,
);

export const getJobStatuses = createSelector(
  getFiltersState,
  (state: FiltersState) => state.jobStatuses,
);

export const getProductNameFilter = createSelector(
  getFiltersState,
  (state: FiltersState) => state.productFilterName,
);

export const areFiltersChanged = createSelector(
  getFiltersState,
  (state: FiltersState) => {
    if (state.previousFilters === null) {
      return false;
    }
    const keys = Object.keys(state).filter((key) => key !== 'previousFilters');
    return keys.some((key) => state[key] !== state.previousFilters[key]);
  },
);

export const getSBASOverlapToggle = createSelector(
  getFiltersState,
  (state: FiltersState) => state.thresholdOverlap,
);

export const getSBASOverlapThreshold = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sbasOverlapThreshold,
);

export const getSarviewsEventTypes = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sarviewsEventTypes,
);

export const getSarviewsEventNameFilter = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sarviewsEventNameFilter,
);

export const getSarviewsEventActiveFilter = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sarviewsEventActiveOnly,
);

export const getSarviewsMagnitudeRange = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sarviewsMagnitudeRange,
);

export const getHyp3ProductTypes = createSelector(
  getFiltersState,
  (state: FiltersState) =>
    state.hyp3ProductTypes.map((productType) => hyp3JobTypes[productType]),
);

export const getSarviewsEventProductSorting = createSelector(
  getFiltersState,
  (state: FiltersState) => state.sarviewsEventProductSorting,
);

export const getGeocodeArea = createSelector(
  getFiltersState,
  (state: FiltersState) => state.geocode,
);

export const getFullBurstIDs = createSelector(
  getFiltersState,
  (state: FiltersState) => state.fullBurstIDs,
);

export const getOperaBurstIDs = createSelector(
  getFiltersState,
  (state: FiltersState) => state.operaBurstIDs,
);

export const getUseCalibrationData = createSelector(
  getFiltersState,
  (state: FiltersState) => state.useCalibrationData,
);

export const getGroupID = createSelector(
  getFiltersState,
  (state: FiltersState) => state.groupID,
);

export const getFrameCoverage = createSelector(
  getFiltersState,
  (state: FiltersState) => state.frameCoverage,
);

export const getJointObservation = createSelector(
  getFiltersState,
  (state: FiltersState) => state.jointObservation,
);

export const getRangeBandwidth = createSelector(
  getFiltersState,
  (state: FiltersState) => state.rangeBandwidth,
);
export const getInstruments = createSelector(
  getFiltersState,
  (state: FiltersState) => state.instrument,
);
export const getScienceProduct = createSelector(
  getFiltersState,
  (state: FiltersState) => state.scienceProduct,
);
export const getProductionConfig = createSelector(
  getFiltersState,
  (state: FiltersState) => state.productionConfig,
);
export const getShouldUseFramesForReference = createSelector(
  getFiltersState,
  (state: FiltersState) => state.useFramesForReference,
);
export const getAriaVersion = createSelector(
  getFiltersState,
  (state: FiltersState) => state.ariaVersion,
);
export const getTileID = createSelector(
  getFiltersState,
  (state: FiltersState) => state.tileID,
);
export const getGranuleList = createSelector(
  getFiltersState,
  (state: FiltersState) => state.granuleList,
);
