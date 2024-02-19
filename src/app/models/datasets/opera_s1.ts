import { Props } from '../filters.model';

export const opera_s1 = {
  id: 'OPERA-S1',
  name: 'OPERA-S1',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT
  ],
  apiValue: {
    dataset: 'OPERA-S1' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  citationUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  frequency: 'C-Band',
  source: {
    name: 'OPERA-JPL',
    url: 'https://www.jpl.nasa.gov/go/opera'
  },
  productTypes: [
    {
      apiValue: 'RTC',
      displayName: 'L2 Radiometric Terrain Corrected (RTC)',
    }, {
      apiValue: 'CSLC',
      displayName: 'L2 Co-registered Single Look Complex (CSLC)',
    }, {
        apiValue: 'RTC-STATIC',
        displayName: 'L2 Radiometric Terrain Corrected Static Layer (RTC-STATIC)'
    }, {
        apiValue: 'CSLC-STATIC',
        displayName: 'L2 Co-registered Single Look Complex Static Layer (CSLC-STATIC)'
    }
  ],
  beamModes: [
    'IW', 'EW'
  ],
  polarizations: [
    'VV',
    'HH',
    'HV',
    'VH'
  ],
  subtypes: [],
  calibrationDatasets: ['OPERA-S1-CALVAL'],
  calibrationProductTypes: [{
    apiValue: 'RTC',
    displayName: 'L2 Radiometric Terrain Corrected (RTC)',
  }, {
    apiValue: 'CSLC',
    displayName: 'L2 Co-registered Single Look Complex (CSLC)',
  }],
  platformDesc: 'OPERA_S1_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
