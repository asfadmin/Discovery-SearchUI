import { Props } from '../filters.model';

export const jers_1 = {
  id: 'JERS-1',
  name: 'JERS-1',
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
  ],
  apiValue: { datasets: 'JERS-1' },
  date: {
    start: new Date('1992/05/20 18:16:38 UTC'),
    end: new Date('1998/10/10 00:57:08 UTC')
  },
  frequency: 'L-Band',
  source: {
    name: 'JAXA',
    url: 'https://global.jaxa.jp/'
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data/jers-1/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/jers-1/#jers1_cite',
  productTypes: [{
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ],
  subtypes: [],
  platformDesc: 'JERS_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
