import { Props } from '../filters.model';

export const opera_disp = {
  id: 'OPERA-DISP',
  name: 'OPERA-DISP',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
  ],
  apiValue: {
    dataset: 'OPERA-DISP' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  citationUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  frequency: 'C-Band',
  source: {
    name: 'OPERA-JPL',
    url: 'https://www.jpl.nasa.gov/go/opera'
  },
  productTypes: [
  ],
  beamModes: [
  ],
  polarizations: [
    'VV', 'HH', 'HV', 'VH'
  ],
  subtypes: [],
//   calibrationDatasets: ['OPERA-S1-CALVAL'],
  calibrationProductTypes: [{
    apiValue: 'RTC',
    displayName: 'L2 Radiometric Terrain Corrected (RTC)',
  }, {
    apiValue: 'CSLC',
    displayName: 'L2 Co-registered Single Look Complex (CSLC)',
  }],
  platformDesc: 'OPERA_DISP_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
