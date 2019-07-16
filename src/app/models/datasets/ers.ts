import { Props } from '../filters.model';

export const ers = {
  id: 'ERS',
  name: 'ERS',
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
  apiValue: { platform: 'ERS' },
  date: {
    start: new Date('1991/08/08 03:18:11 UTC'),
    end: new Date('2011/07/03 00:23:48 UTC')
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
