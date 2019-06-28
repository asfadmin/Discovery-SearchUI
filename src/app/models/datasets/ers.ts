import { Props } from '../filters.model';

export const ers = {
  name: 'ERS',
  properties: new Set<Props>([
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
  ]),
  apiValue: { platform: 'ERS' },
  date: {
    start: new Date(1991, 0, 1),
    end: new Date(2011, 0, 1)
  },
  source: {
    name: 'ESA',
    url: 'http://www.esa.int/ESA'
  },
  frequency: 'C-Band',
  infoUrl: 'https://www.asf.alaska.edu/sar-data/ers-2/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/ers-2/how-to-cite/',
  productTypes: [{
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'VV'
  ]
};
