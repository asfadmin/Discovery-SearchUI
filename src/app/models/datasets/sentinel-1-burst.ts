import { Props } from '../filters.model';

export const sentinel_1_bursts = {
  id: 'SENTINEL-1 BURSTS',
  name: 'S1 Bursts',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
    Props.SUBTYPE,
  ],
  apiValue: { platform: 'SENTINEL-1', instrument: 'C-SAR', processingLevel: 'BURST' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://www.asf.alaska.edu/sar-data-sets/sentinel-1/',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/sentinel-1/sentinel-1-how-to-cite/',
  frequency: 'C-Band',
  source: {
    name: 'ESA',
    url: 'https://www.esa.int/ESA'
  },
  productTypes: [
    {
      apiValue: 'BURST',
      displayName: 'SLC Burst (BURST)'
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
  subtypes: [{
    displayName: 'Sentinel-1A',
    apiValue: 'SA',
  }, {
    displayName: 'Sentinel-1B',
    apiValue: 'SB',
  }],
  platformDesc: 'Sentinel-1 BURST products are the individual radar pulse responses that make up a parent SLC.',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};