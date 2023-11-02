import { Props } from '../filters.model';

export const alos = {
  id: 'ALOS',
  name: 'ALOS PALSAR',
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
    Props.OFF_NADIR_ANGLE,
    Props.FARADAY_ROTATION,
    Props.STACK_SIZE,
    Props.BASELINE_TOOL,
  ],
  apiValue: { datasets: 'ALOS PALSAR' },
  date: {
    start: new Date('2006/05/16 03:36:51 UTC'),
    end: new Date('2011/04/21 20:23:36 UTC')
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/alos-palsar/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/alos-palsar/alos-palsar-how-to-cite/',
  frequency: 'L-Band',
  source: {
    name: 'JAXA/METI',
    url: 'https://global.jaxa.jp/'
  },
  productTypes: [{
    apiValue: 'L1.0',
    displayName: 'Level 1.0'
  }, {
    apiValue: 'L1.1',
    displayName: 'Level 1.1 Complex'
  }, {
    apiValue: 'L1.5',
    displayName: 'Level 1.5 Image'
  }, {
    apiValue: 'L2.2',
    displayName: 'Level 2.2'
  }, {
    apiValue: 'RTC_LOW_RES',
    displayName: 'Low-Res Terrain Corrected'
  }, {
    apiValue: 'RTC_HI_RES',
    displayName: 'Hi-Res Terrain Corrected'
  }, {
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }],
  beamModes: [
    'DSN', 'FBS', 'FBD', 'PLR', 'WB1', 'WB2'
  ],
  polarizations: [
    'HH',
    'HH 3scan',
    'HH 4scan',
    'HH 5scan',
    'HH+HV',
    'UNKNOWN',
    'VV',
    'VV+VH',
    'quadrature',
  ],
  subtypes: [],
  platformDesc:  'PALSAR_DESC' ,
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
