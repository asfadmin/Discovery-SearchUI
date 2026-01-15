import { sentinel_1, sentinel_1_bursts } from '../dataset.model';
import { Hyp3JobType, JobOptionType } from './hyp3-job-type.model';

export const RtcGammaJobType: Hyp3JobType = {
  id: 'RTC_GAMMA',
  name: 'RTC GAMMA',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/guides/rtc_product_guide/',
  description: 'DESCRIPTION_RADIOMETRIC_TERRAIN_CORRECTION',
  numProducts: 1,
  productTypes: [
    {
      dataset: sentinel_1,
      productTypes: ['SLC', 'GRD_HD', 'GRD_HS'],
      beamModes: ['IW'],
      polarizations: ['VV+VH', 'HH+HV', 'VV', 'HH'],
    },
  ],
  options: [
    {
      name: 'Radiometry',
      apiName: 'radiometry',
      type: JobOptionType.DROPDOWN,
      options: [
        {
          name: 'gamma0',
          apiValue: 'gamma0',
        },
        {
          name: 'sigma0',
          apiValue: 'sigma0',
        },
      ],
      default: 'gamma0',
      info: 'INFO_BACKSCATTER_COEFFICIENT',
    },
    {
      name: 'Scale',
      apiName: 'scale',
      type: JobOptionType.DROPDOWN,
      options: [
        {
          name: 'power',
          apiValue: 'power',
        },
        {
          name: 'decibel',
          apiValue: 'decibel',
        },
        {
          name: 'amplitude',
          apiValue: 'amplitude',
        },
      ],
      default: 'power',
      info: 'INFO_SCALE_OF_OUTPUT_IMAGE',
    },
    {
      name: 'Pixel Spacing',
      apiName: 'resolution',
      type: JobOptionType.DROPDOWN,
      options: [
        {
          name: '30 meters',
          apiValue: 30,
        },
        {
          name: '20 meters',
          apiValue: 20,
        },
        {
          name: '10 meters',
          apiValue: 10,
        },
      ],
      default: 30,
      info: 'INFO_PRODUCT_PIXEL',
    },
    {
      name: 'DEM Matching',
      apiName: 'dem_matching',
      type: JobOptionType.TOGGLE,
      default: false,
      info: 'INFO_DEM_MATCHING',
    },
    {
      name: 'Speckle Filter',
      apiName: 'speckle_filter',
      type: JobOptionType.TOGGLE,
      default: false,
      info: 'INFO_SPECKLE_FILTER',
    },
    {
      name: 'DEM',
      apiName: 'include_dem',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCLUDE_DEM',
    },
    {
      name: 'Incidence Angle Map',
      apiName: 'include_inc_map',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCIDENCE_ANGLE_MAP',
    },
    {
      name: 'Scattering Area Map',
      apiName: 'include_scattering_area',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_SCATTERING_AREA_MAP',
    },
    {
      name: 'RGB Decomposition',
      apiName: 'include_rgb',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_RGB_DECOMPOSITION',
    },
  ],
};

export const InsarGammaJobType: Hyp3JobType = {
  id: 'INSAR_GAMMA',
  name: 'InSAR GAMMA',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/',
  description: `INSAR_DESC`,
  numProducts: 2,
  productTypes: [
    {
      dataset: sentinel_1,
      productTypes: ['SLC'],
      beamModes: ['IW'],
      polarizations: ['VV+VH', 'HH+HV', 'VV', 'HH'],
    },
  ],
  options: [
    {
      name: 'Looks',
      apiName: 'looks',
      type: JobOptionType.DROPDOWN,
      options: [
        {
          name: '20x4',
          apiValue: '20x4',
        },
        {
          name: '10x2',
          apiValue: '10x2',
        },
      ],
      default: '20x4',
      info: 'INFO_LOOKS_RANGE_AZIMUTH',
    },
    {
      name: 'Phase Filter',
      apiName: 'phase_filter_parameter',
      type: JobOptionType.RANGE,
      info: 'INFO_PHASE_FILTER',
      default: 0.6,
      range: { start: 0.0, end: 1.0 },
    },
    {
      name: 'Water Mask',
      apiName: 'apply_water_mask',
      type: JobOptionType.TOGGLE,
      default: false,
      info: 'INFO_WATER_MASK',
    },
    {
      name: 'DEM',
      apiName: 'include_dem',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCLUDE_DEM_FILE',
    },
    {
      name: 'Incidence Angle Maps',
      apiName: 'include_inc_map',
      type: JobOptionType.CHECKBOX,
      default: false,
      info:'INFO_INCLUDE_INCIDENCE_ANGLE_MAPS',
    },
    {
      name: 'Look Vectors',
      apiName: 'include_look_vectors',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCLUDE_LOOK_VECTORS',
    },
    {
      name: 'Displacement Maps',
      apiName: 'include_displacement_maps',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCLUDE_DISPLACEMENT_MAPS',
    },
    {
      name: 'Wrapped Phase',
      apiName: 'include_wrapped_phase',
      type: JobOptionType.CHECKBOX,
      default: false,
      info: 'INFO_INCLUDE_WRAPPED_PHASE'
    },
    {
      name: 'Set MintPy Options',
      apiName: null,
      type: JobOptionType.SUBSET,
      default: false,
      optionSubset: [
        {
          apiName: 'include_dem',
          value: true,
        },
        {
          apiName: 'include_look_vectors',
          value: true,
        },
      ],
      info:'INFO_MINTPY_OPTIONS'
    },
  ],
};

export const InsarIsceBurstJobType: Hyp3JobType = {
  id: 'INSAR_ISCE_BURST',
  name: 'InSAR ISCE Burst',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/guides/burst_insar_product_guide/',
  description: `INSAR_DESC`,
  numProducts: 2,
  productTypes: [
    {
      dataset: sentinel_1_bursts,
      productTypes: ['BURST'],
      beamModes: ['IW'],
      polarizations: ['VV', 'HH'],
    },
  ],
  options: [
    {
      name: 'Looks',
      apiName: 'looks',
      type: JobOptionType.DROPDOWN,
      options: [
        {
          name: '20x4',
          apiValue: '20x4',
        },
        {
          name: '10x2',
          apiValue: '10x2',
        },
        {
          name: '5x1',
          apiValue: '5x1',
        },
      ],
      default: '20x4',
      info: `Number of looks to take in range and azimuth.`,
    },
    {
      name: 'Water Mask',
      apiName: 'apply_water_mask',
      type: JobOptionType.TOGGLE,
      default: false,
      info: 'INFO_INSAR_ISCE_BURST_WATER_MASK'
    },
  ],
};

export const AutoRift: Hyp3JobType = {
  id: 'AUTORIFT',
  name: 'autoRIFT',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/products/#autorift',
  description: 'AUTORIFT_DESC',
  numProducts: 2,
  productTypes: [
    {
      dataset: sentinel_1,
      productTypes: ['SLC', 'GRD_HD'],
      beamModes: ['IW'],
      polarizations: ['VV+VH', 'HH+HV', 'VV', 'HH'],
    },
  ],
  options: [],
};

export const AriaS1GunwJobType = {
  id: 'ARIA_S1_GUNW',
  name: 'ARIA_S1_GUNW',
  infoUrl:
    'https://hyp3-docs.asf.alaska.edu/guides/gunw_product_guide/#aria-sentinel-1-gunw-product-guide',
  description: 'ARIAS1GUNW_JOB_TYPE_DESC',
  numProducts: 2,
  productTypes: [
    {
      dataset: sentinel_1,
      productTypes: ['SLC'],
      beamModes: ['IW'],
      polarizations: ['VV+VH', 'HH+HV', 'VV', 'HH'],
    },
  ],
  options: [],
};

export const hyp3JobTypes = {
  RTC_GAMMA: RtcGammaJobType,
  INSAR_GAMMA: InsarGammaJobType,
  INSAR_ISCE_BURST: InsarIsceBurstJobType,
  AUTORIFT: AutoRift,
  ARIA_S1_GUNW: AriaS1GunwJobType,
};

export const hyp3JobTypesList = Object.values(hyp3JobTypes);

export const hyp3DefaultJobOptions = hyp3JobTypesList.reduce(
  (options, jobType) => {
    const optionsForJobType = {};

    jobType.options.forEach(
      (option) => (optionsForJobType[option.apiName] = option.default),
    );
    options[jobType.id] = optionsForJobType;

    return options;
  },
  {},
);

export const hyp3JobOptionsByName = hyp3JobTypesList.reduce(
  (options, jobType) => {
    jobType.options.forEach((option) => (options[option.apiName] = option));
    return options;
  },
  {},
);
export const hyp3JobOptionsOrdered = hyp3JobTypesList.reduce(
  (options, jobType) => [...options, ...jobType.options],
  [],
);
