import { Props } from '../filters.model';

export const airsar = {
  id: 'AIRSAR',
  name: 'AIRSAR',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.MISSION_NAME,
    Props.FARADAY_ROTATION,
  ],
  apiValue: { platform: 'AIRSAR' },
  date: {
    start: new Date('1990/03/02 00:00:00 UTC'),
    end: new Date('2004/12/03 23:59:59 UTC')
  },
  frequency: 'L-Band, P-Band, or C-Band',
  infoUrl: 'https://www.asf.alaska.edu/sar-data/airsar/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/airsar/#airsar_cite',
  source: null,
  productTypes: [{
    apiValue: 'CTIF',
    displayName: 'C-Band JPG'
  }, {
    apiValue: 'PTIF',
    displayName: 'P-Band JPG'
  }, {
    apiValue: 'LTIF',
    displayName: 'L-Band JPG'
  }, {
    apiValue: 'JPG',
    displayName: 'JPG'
  }, {
    apiValue: 'LSTOKES',
    displayName: 'L-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'PSTOKES',
    displayName: 'P-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'CSTOKES',
    displayName: 'C-Band DEM & Compressed Stokes Matrix'
  }, {
    apiValue: 'DEM',
    displayName: 'DEM'
  }],
  beamModes: [ '3FP', 'ATI', 'XTI' ],
  polarizations: [
    'Full'
  ],
  subtypes: [],
  platformDesc: 'AIRSAR was an all-weather imaging tool able to penetrate through clouds and collect data at night. The longer wavelengths ' +
    'could also penetrate into the forest canopy and...',
  platformIcon: '/assets/icons/flight_black_48dp.svg',
};
