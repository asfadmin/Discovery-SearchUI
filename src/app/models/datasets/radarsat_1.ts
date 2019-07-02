import { Props } from '../filters.model';

export const radarsat_1 = {
  name: 'RADARSAT-1',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
  ],
  apiValue: { platform: 'RADARSAT-1' },
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2008, 0, 1)
  },
  frequency: 'C-Band',
  source: {
    name: 'CSA',
    url: null
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data/radarsat-1/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/radarsat-1/how-to-cite/',
  productTypes: [{
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }],
  beamModes: [
    'EH3', 'EH4', 'EH6', 'EL1', 'FN1', 'FN2', 'FN3', 'FN4',
    'FN5', 'SNA', 'SNB', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5',
    'ST6', 'ST7', 'SWA', 'SWB', 'WD1', 'WD2', 'WD3'
  ],
  polarizations: [
    'HH'
  ]
};
