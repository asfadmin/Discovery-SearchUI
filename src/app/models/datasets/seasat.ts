import { Props } from '../filters.model';

export const seasat = {
  id: 'SEASAT',
  name: 'SEASAT',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
  ],
  apiValue: { dataset: 'SEASAT' },
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
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/seasat/seasat-how-to-cite/',
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
  platformDesc: 'SEASAT_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
