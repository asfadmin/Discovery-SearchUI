import { Props } from '../filters.model';

export const seasat = {
  id: 'SEASAT',
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
    start: new Date('1978/07/04 12:06:00 UTC'),
    end: new Date('1978/10/10 01:29:10 UTC')
  },
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/seasat/',
  citationUrl: 'https://www.asf.alaska.edu/how-to-cite-data/',
  productTypes: [{
    apiValue: 'GEOTIFF',
    displayName: 'Level One GeoTIFF product'
  }, {
    apiValue: 'L1',
    displayName: 'Level One HDF5 Image'
  } ],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ],
  subtypes: [],
};
