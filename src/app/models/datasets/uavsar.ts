import { Props } from '../filters.model';

export const uavsar = {
  id: 'UAVSAR',
  name: 'UAVSAR',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.POLARIZATION,
    Props.MISSION_NAME,
  ],
  apiValue: { datasets: 'UAVSAR' },
  date: { start: new Date('2008/04/28 21:10:16 UTC') },
  infoUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/#uavsar_cite',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  productTypes: [{
    apiValue: 'AMPLITUDE',
    displayName: 'Amplitude'
  }, {
    apiValue: 'STOKES',
    displayName: 'Compressed Stokes Matrix'
  }, {
    apiValue: 'AMPLITUDE_GRD',
    displayName: 'Ground Projected Amplitude'
  }, {
    apiValue: 'PROJECTED',
    displayName: 'Ground Projected Complex'
  }, {
    apiValue: 'PROJECTED_ML3X3',
    displayName: 'Ground Projected Complex, 3X3 Resampled'
  }, {
    apiValue: 'PROJECTED_ML5X5',
    displayName: 'Ground Projected Complex, 5X5 Resampled'
  }, {
    apiValue: 'INTERFEROMETRY_GRD',
    displayName: 'Ground Projected Interferogram'
  }, {
    apiValue: 'INTERFEROMETRY',
    displayName: 'Interferogram'
  }, {
    apiValue: 'COMPLEX',
    displayName: 'Multi-look Complex'
  }, {
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    apiValue: 'INC',
    displayName: 'Incidence angle'
  }, {
    apiValue: 'SLOPE',
    displayName: 'Slope'
  }, {
    apiValue: 'DEM_TIFF',
    displayName: 'GEOTIFF Height File'
  }, {
    apiValue: 'PAULI',
    displayName: 'Pauli Decomposition'
  }, {
    apiValue: 'METADATA',
    displayName: 'Annotation file / Metadata'
  }],
  beamModes: [ 'POL', 'RPI' ],
  polarizations: [
    'Full',
    'HH'
  ],
  subtypes: [],
  platformDesc: 'UAVSAR_DESC',
  platformIcon: '/assets/icons/flight_black_48dp.svg',
};
