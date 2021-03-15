import { sentinel_1 } from './dataset.model';
import { Hyp3JobType, JobOptionType } from './hyp3-job-type.model';

export const RtcGammaJobType: Hyp3JobType = {
  id: 'RTC_GAMMA',
  name: 'RTC Gamma',
  numProducts: 1,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC', 'GRD_HD', 'GRD_HS'
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
    options: ['gamma0', 'sigma0'],
    info: `
      Backscatter coefficient normalization, either by ground area
      (sigma0) or illuminated area projected into the look direction (gamma0).
    `
  }, {
    name: 'Scale',
    apiName: 'scale',
    type: JobOptionType.DROPDOWN,
    options: ['power', 'amplitude'],
    info: `Scale of output image; either power or amplitude.`
  }, {
    name: 'DEM Matching',
    apiName: 'dem_matching',
    type: JobOptionType.TOGGLE,
    info: `
      Coregisters SAR data to the DEM, rather than using
      dead reckoning based on orbit files.
    `
  }, {
    name: 'Include DEM',
    apiName: 'include_dem',
    type: JobOptionType.TOGGLE,
    info: `Include the DEM file in the product package.`
  }, {
    name: 'Include Inc. Angle Map',
    apiName: 'include_inc_map',
    type: JobOptionType.TOGGLE,
    info: `Include the incidence angle map in the product package.`
  }, {
    name: 'Include Scattering Area',
    apiName: 'include_scattering_area',
    type: JobOptionType.TOGGLE,
    info: `Include the scattering area in the product package.`
  }, {
    name: 'Include RGB',
    apiName: 'include_rgb',
    type: JobOptionType.TOGGLE,
    info: `
      Include a false-color RGB decomposition in the product
      package for dual-pol granules (ignored for single-pol granules)
    `
  }, {
    name: 'Speckle Filter',
    apiName: 'speckle_filter',
    type: JobOptionType.TOGGLE,
    info: `Apply an Enhanced Lee speckle filter.`
  }]
};

export const InsarGammaJobType: Hyp3JobType = {
  id: 'INSAR_GAMMA',
  name: 'InSar Gamma',
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
    options: ['20x4', '10x2'],
    info: `Number of looks to take in range and azimuth.`
  }, {
    name: 'Include Look Vectors',
    apiName: 'include_look_vectors',
    type: JobOptionType.TOGGLE,
    info: `
      Include the look vector theta and phi files in the product package.
    `
  }, {
    name: 'Include Los Displacement',
    apiName: 'include_los_displacement',
    type: JobOptionType.TOGGLE,
    info: `
      Include a GeoTIFF in the product package containing displacement
      values along the Line-Of-Sight (LOS)
    `
  }]
};

export const hyp3JobTypes = {
  RTC_GAMMA: RtcGammaJobType,
  INSAR_GAMMA: InsarGammaJobType
};

export const hyp3JobTypesList = Object.values(hyp3JobTypes);
