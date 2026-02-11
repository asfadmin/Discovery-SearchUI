import { Props } from '../filters.model';

export const alos_2 = {
  id: 'ALOS-2',
  name: 'ALOS-2',
  subName: '',
  beta: false,
  priority: 60,
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
    Props.USE_BEAM_MODE,
    Props.USE_PROCESSING_TYPE,
  ],
  apiValue: { dataset: 'ALOS-2' },
  date: {
    start: new Date('2014/08/01 00:00:00 UTC'),
  },
  infoUrl: 'https://www.earthdata.nasa.gov/data/catalog/asf-alos2-l1-psr2-1',
  citationUrl:
    'https://www.earthdata.nasa.gov/data/catalog/asf-alos2-l1-psr2-1#toc-citation',
  frequency: 'L-Band',
  source: {
    name: 'JAXA/METI',
    url: 'https://global.jaxa.jp/',
  },
  productTypes: [
    {
      apiValue: '1.1',
      displayName: 'Level 1.1',
    },
    {
      apiValue: '1.5',
      displayName: 'Level 1.5',
    },
    {
      apiValue: '3.1',
      displayName: 'Level 3.1',
    },
  ],
  beamModes: ['WBS', 'WBD', 'WWS', 'WWD', 'VBS', 'VBD', 'WD1', 'WD2'],
  polarizations: ['HH', 'HV', 'VV', 'VH'],
  subtypes: [],
  platformDesc: 'ALOS_2_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
