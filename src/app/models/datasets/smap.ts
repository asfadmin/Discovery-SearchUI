import { Props } from '../filters.model';

export const smap = {
  id: 'SMAP',
  name: 'SMAP',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.ABSOLUTE_ORBIT,
  ],
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
      apiValue: 'L1A_Radar_RO_HDF5',
      displayName: 'L1A Radar Receive Only Product',
    },
    {
      apiValue: 'L1A_Radar_HDF5',
      displayName: 'L1A Radar Product',
    },
    {
      apiValue: 'L1B_S0_LoRes_HDF5',
      displayName: 'L1B S0 LoRes Product',
    },
    {
      apiValue: 'L1C_S0_HiRes_HDF5',
      displayName: 'L1C S0 HiRes Product',
    },
    {
      apiValue: 'L1A_Radar_RO_QA',
      displayName: 'L1A Radar Receive Only Data Quality',
    },
    {
      apiValue: 'L1A_Radar_QA',
      displayName: 'L1A Radar Data Quality Information',
    },
    {
      apiValue: 'L1B_S0_LoRes_QA',
      displayName: 'L1B S0 LoRes Data Quality Information',
    },
    {
      apiValue: 'L1C_S0_HiRes_QA',
      displayName: 'L1C S0 HiRes Data Quality Information',
    },
    {
      apiValue: 'L1A_Radar_RO_ISO_XML',
      displayName: 'L1A Radar Receive Only Product Metadata',
    },
    {
      apiValue: 'L1B_S0_LoRes_ISO_XML',
      displayName: 'L1B S0 LoRes Metadata',
    },
    {
      apiValue: 'L1C_S0_HiRes_ISO_XML',
      displayName: 'L1C S0 HiRes Metadata',
    },
  ],
  beamModes: ['STD'],
  polarizations: [],
  platforms: [],
  description: 'SMAP_DESC',
  icon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    displays: {
      'L1A_RADAR.h5': 'Level 1A Radar Product',
      'L1A_RADAR_RO.h5': 'Level 1A Receive Only Product',
      'L1B_S0_LORES.h5': 'Level 1B Low Resolution Product',
      'L1C_S0_HIRES.h5': 'Level 1C High Resolution Product',

      'L1A_RADAR.xml': 'Level 1A Radar Product Metadata',
      'L1A_RADAR_RO.xml': 'Level 1A Receive Only Product Metadata',
      'L1B_S0_LORES.xml': 'Level 1B Low Resolution Product Metadata',
      'L1C_S0_HIRES.xml': 'Level 1C High Resolution Product Metadata',

      'L1A_RADAR.qa': 'Level 1A Radar Data Quality',
      'L1A_RADAR_RO.qa': 'Level 1A Receive Only Data Quality',
      'L1B_S0_LORES.qa': 'Level 1B Low Resolution Data Quality',
      'L1C_S0_HIRES.qa': 'Level 1C High Resolution Data Quality',
    },
  },
};
