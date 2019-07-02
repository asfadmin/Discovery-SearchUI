import { Props } from '../filters.model';

export const seasat = {
  name: 'SEASAT',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
  ],
  apiValue: { platform: 'SEASAT' },
  date: {
    start: new Date(1978, 0, 1),
    end: new Date(1978, 0, 1)
  },
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  infoUrl: 'https://www.asf.alaska.edu/seasat/',
  citationUrl: 'https://www.asf.alaska.edu/seasat/how-to-cite/',
  productTypes: [{
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'GEOTIFF',
    displayName: 'Level One GeoTIFF product'
  }, {
    apiValue: 'L1',
    displayName: 'Level One HDF5 Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ]
};
