import { sentinel_1 } from './dataset.model';
import { Hyp3JobType, JobOptionType } from './hyp3-job-type.model';

export const RtcGammaJobType: Hyp3JobType = {
  id: 'RTC_GAMMA',
  name: 'RTC GAMMA',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/guides/rtc_product_guide/', description: `
    Radiometric Terrain Correction (RTC) removes geometric and radiometric
    distortions in SAR datasets and creates analysis-ready data suitable for use
    in GIS applications.
  `,
  numProducts: 1,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC', 'GRD_HD'
    ],
    beamModes: ['IW'],
    polarizations: [
      'VV+VH', 'HH+HV', 'VV', 'HH',
    ]
  }],
  options: [{
    name: 'Radiometry',
    apiName: 'radiometry',
    type: JobOptionType.DROPDOWN,
    options: [{
      name: 'gamma0',
      apiValue: 'gamma0'
    }, {
      name: 'sigma0',
      apiValue: 'sigma0'
    }],
    default: 'gamma0',
    info: `
      Backscatter coefficient normalization, either by ground area
      (sigma0) or illuminated area projected into the look direction (gamma0).
    `
  }, {
    name: 'Scale',
    apiName: 'scale',
    type: JobOptionType.DROPDOWN,
    options: [{
      name: 'power',
      apiValue: 'power'
    }, {
      name: 'amplitude',
      apiValue: 'amplitude'
    }],
    default: 'power',
    info: `Scale of output image; either power or amplitude.`
  }, {
    name: 'DEM Name',
    apiName: 'dem_name',
    type: JobOptionType.DROPDOWN,
    options: [{
      name: 'Copernicus DEM',
      apiValue: 'copernicus'
    }, {
      name: 'NED/SRTM',
      apiValue: 'legacy'
    }],
    default: 'copernicus',
    info: `
      Name of the DEM to use for processing. copernicus will use the Copernicus
      GLO-30 Public DEM, while legacy will use the DEM with the best coverage
      from ASF's legacy SRTM/NED datasets.
    `
  }, {
    name: 'DEM Matching',
    apiName: 'dem_matching',
    type: JobOptionType.TOGGLE,
    default: false,
    info: `
      Coregisters SAR data to the DEM, rather than using
      dead reckoning based on orbit files.
    `
  }, {
    name: 'Speckle Filter',
    apiName: 'speckle_filter',
    type: JobOptionType.TOGGLE,
    default: false,
    info: `Apply an Enhanced Lee speckle filter.`
  }, {
    name: 'DEM',
    apiName: 'include_dem',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `Include the DEM file in the product package.`
  }, {
    name: 'Incidence Angle Maps',
    apiName: 'include_inc_map',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `Include the incidence angle maps (local and ellipsoidal) in the product package.`
  }, {
    name: 'Scattering Area',
    apiName: 'include_scattering_area',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `Include the scattering area in the product package.`
  }, {
    name: 'RGB Decomposition',
    apiName: 'include_rgb',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include a false-color RGB decomposition in the product
      package for dual-pol granules (ignored for single-pol granules).
    `
  }]
};

export const InsarGammaJobType: Hyp3JobType = {
  id: 'INSAR_GAMMA',
  name: 'InSAR GAMMA',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/guides/insar_product_guide/',
  description: `
    Interferometric Synthetic Aperture Radar (InSAR) processing uses two SAR images
    collected over the same area to determine geometric properties of the surface.
    The phase measurements of the two images acquired at different times are differenced
    to detect and quantify surface changes.
  `,
  numProducts: 2,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC',
    ],
    beamModes: ['IW'],
    polarizations: [
      'VV+VH', 'HH+HV', 'VV', 'HH',
    ]
  }],
  options: [{
    name: 'Looks',
    apiName: 'looks',
    type: JobOptionType.DROPDOWN,
    options: [{
      name: '20x4',
      apiValue: '20x4'
    }, {
      name: '10x2',
      apiValue: '10x2'
    }],
    default: '20x4',
    info: `Number of looks to take in range and azimuth.`
  }, {
    name: 'Water Mask',
    apiName: 'apply_water_mask',
    type: JobOptionType.TOGGLE,
    default: false,
    info: `
      Sets pixels over coastal and large inland waterbodies as invalid
      for phase unwrapping.
    `
  }, {
    name: 'DEM',
    apiName: 'include_dem',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include the DEM file in the product package.
    `
  }, {
    name: 'Incidence Angle Maps',
    apiName: 'include_inc_map',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include the incidence angle maps (local and ellipsoidal) in the product package.
    `
  }, {
    name: 'Look Vectors',
    apiName: 'include_look_vectors',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include the look vector theta and phi files in the product package.
    `
  }, {
    name: 'Displacement Maps',
    apiName: 'include_displacement_maps',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include displacement maps (line-of-sight and vertical) in the product package.
    `
  }, {
    name: 'Wrapped Phase',
    apiName: 'include_wrapped_phase',
    type: JobOptionType.CHECKBOX,
    default: false,
    info: `
      Include the wrapped phase GeoTIFF in the product package.
    `
  }, {
    name: 'Set MintPy Options',
    apiName: null,
    type: JobOptionType.SUBSET,
    default: false,
    optionSubset: [{
      apiName: 'include_dem',
      value: true
    }, {
      apiName: 'include_look_vectors',
      value: true
    }],
    info: `
      Set options to make products compatible with MintPy.
    `
  }]
};

export const AutoRift: Hyp3JobType = {
  id: 'AUTORIFT',
  name: 'autoRIFT',
  infoUrl: 'https://hyp3-docs.asf.alaska.edu/products/#autorift',
  description: `
    autoRIFT is a highly accurate and efficient algorithm for finding the pixel
    displacement between two radar images.
  `,
  numProducts: 2,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC', 'GRD_HD'
    ],
    beamModes: ['IW'],
    polarizations: [
      'VV+VH', 'HH+HV', 'VV', 'HH',
    ]
  }],
  options: []
};

export const hyp3JobTypes = {
  RTC_GAMMA: RtcGammaJobType,
  INSAR_GAMMA: InsarGammaJobType,
  AUTORIFT: AutoRift
};

export const hyp3JobTypesList = Object.values(hyp3JobTypes);
export const hyp3DefaultJobOptions = hyp3JobTypesList.reduce((options, jobType) => {
  jobType.options.forEach(
    option => options[option.apiName] = option.default
  );
  return options;
}, {});
export const hyp3JobOptionsByName = hyp3JobTypesList.reduce((options, jobType) => {
  jobType.options.forEach(
    option => options[option.apiName] = option
  );
  return options;
}, {});
export const hyp3JobOptionsOrdered = hyp3JobTypesList.reduce(
  (options, jobType) => [...options, ...jobType.options]
 , []);
