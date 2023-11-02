import { Props } from '../filters.model';

export const ers = {
  id: 'ERS',
  name: 'ERS',
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
    Props.BASELINE_TOOL,
    Props.SUBTYPE,
  ],
  apiValue: { datasets: 'ERS' },
  date: {
    start: new Date('1991/08/08 03:18:11 UTC'),
    end: new Date('2011/07/03 00:23:48 UTC')
  },
  source: {
    name: 'ESA',
    url: 'https://www.esa.int/ESA'
  },
  frequency: 'C-Band',
  infoUrl: 'https://www.asf.alaska.edu/sar-data/ers-1/',
  citationUrl: 'https://asf.alaska.edu/information/how-to-cite-data/',
  productTypes: [{
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'VV'
  ],
  subtypes: [{
    displayName: 'ERS-1',
    apiValue: 'E1',
  }, {
    displayName: 'ERS-2',
    apiValue: 'E2',
  }],
  platformDesc: 'ERS_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
