import { Props } from '../filters.model';

export const uavsar = {
  id: 'UAVSAR',
  name: 'UAVSAR',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.POLARIZATION,
    Props.MISSION_NAME,
  ],
  apiValue: { platform: 'UAVSAR' },
  date: { start: new Date(2008, 0, 1) },
  infoUrl: 'https://www.asf.alaska.edu/sar-data/uavsar/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/uavsar/how-to-cite/',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  productTypes: [{
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    apiValue: 'INC',
    displayName: 'Incidence angle'
  }, {
    apiValue: 'INTERFEROMETRY_GRD',
    displayName: 'Ground Projected Interferogram'
  }, {
    apiValue: 'HD5',
    displayName: 'HDF5'
  }, {
    apiValue: 'SLOPE',
    displayName: 'Slope'
  }, {
    apiValue: 'AMPLITUDE_GRD',
    displayName: 'Ground Projected Amplitude'
  }, {
    apiValue: 'INTERFEROMETRY',
    displayName: 'Interferogram'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'AMPLITUDE',
    displayName: 'Amplitude'
  }, {
    apiValue: 'PROJECTED_ML5X5',
    displayName: 'Ground Projected Complex, 5X5 Resampled'
  }, {
    apiValue: 'METADATA',
    displayName: 'Annotation file / Metadata'
  }, {
    apiValue: 'DEM_TIFF',
    displayName: 'GEOTIFF Height File'
  }, {
    apiValue: 'STOKES',
    displayName: 'Compressed Stokes Matrix'
  }, {
    apiValue: 'PROJECTED',
    displayName: 'Ground Projected Complex'
  }, {
    apiValue: 'PAULI',
    displayName: 'Pauli Decomposition'
  }, {
    apiValue: 'COMPLEX',
    displayName: 'Multi-look Complex'
  }],
  beamModes: [ 'POL', 'RPI' ],
  polarizations: [
    'Full',
    'HH'
  ]
};
