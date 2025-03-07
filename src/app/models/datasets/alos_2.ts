import { Props } from '../filters.model';

export const alos_2 = {
  id: 'ALOS-2',
  name: 'ALOS_2',
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
    Props.BASELINE_TOOL,
    Props.USE_BEAM_MODE
  ],
  apiValue: { dataset: 'ALOS-2' },
  date: {
    start: new Date('2014/08/01 00:00:00 UTC'),
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/alos-palsar/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/alos-palsar/alos-palsar-how-to-cite/',
  frequency: 'L-Band',
  source: {
    name: 'JAXA/METI',
    url: 'https://global.jaxa.jp/'
  },
  productTypes: [],
  beamModes: [
     'WBS',
     'WBD',
     'WWS',
     'WWD',
     'VBS',
     'VBD',
     'WD1',
     'WD2'
  ],
  polarizations: [
    'HH',
    'HV',
    'VV',
    'VH'
  ],
  subtypes: [],
  platformDesc:  'ALOS_2_DESC' ,
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
