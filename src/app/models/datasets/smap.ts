import { Props } from '../filters.model';

export const smap = {
  id: 'SMAP',
  name: 'SMAP',
  subName: '',
  beta: false,
  properties: [Props.DATE, Props.FLIGHT_DIRECTION, Props.ABSOLUTE_ORBIT],
  apiValue: { dataset: 'SMAP' },
  date: { start: new Date('2015/04/13 17:57:07 UTC') },
  infoUrl:
    'https://asf.alaska.edu/datasets/daac/soil-moisture-active-passive-smap-mission/',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/',
  },
  citationUrl:
    'https://asf.alaska.edu/data-sets/sar-data-sets/smap/smap-how-to-cite/',
  productTypes: [
    {
      apiValue: 'L1A_RADAR_RO',
      displayName: 'L1A Radar Receive Only Product',
    },
    {
      apiValue: 'L1A_RADAR',
      displayName: 'L1A Radar Product',
    },
    {
      apiValue: 'L1B_S0_LORES',
      displayName: 'L1B S0 LoRes Product',
    },
    {
      apiValue: 'L1C_S0_HIRES',
      displayName: 'L1C S0 HiRes Product',
    },
  ],
  beamModes: ['STD'],
  polarizations: [],
  platforms: [],
  description: 'SMAP_DESC',
  icon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    displays: {
      'L1A_RADAR.h5': 'L1A Radar Product',
      'L1A_RADAR_RO.h5': 'L1A Receive Only Product',
      'L1B_S0_LORES.h5': 'L1B S0 LoRes Data Product',
      'L1C_S0_HIRES.h5': 'L1C S0 HiRes Product',

      'L1A_RADAR.xml': 'L1A Radar Product Metadata',
      'L1A_RADAR_RO.xml': 'L1A Receive Only Product Metadata',
      'L1B_S0_LORES.xml': 'L1B S0 LoRes Product Metadata',
      'L1C_S0_HIRES.xml': 'L1C S0 HiRes Product Metadata',

      'L1A_RADAR.qa': 'L1A Radar Data Quality',
      'L1A_RADAR_RO.qa': 'L1A Receive Only Data Quality',
      'L1B_S0_LORES.qa': 'L1B S0 LoRes Data Quality',
      'L1C_S0_HIRES.qa': 'L1C S0 HiRes Data Quality',
    },
  },
};
