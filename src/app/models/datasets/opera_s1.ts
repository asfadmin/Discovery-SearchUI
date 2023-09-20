import { Props } from '../filters.model';

export const opera_s1 = {
  id: 'OPERA-S1',
  name: 'OPERA-S1',
  subName: '',
  beta: true,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
    Props.SUBTYPE,
  ],
  apiValue: { platform: 'SENTINEL-1', instrument: 'C-SAR', processingLevel: 'RTC' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://sentinels.copernicus.eu/web/sentinel/user-guides/sentinel-1-sar/acquisition-modes/interferometric-wide-swath',
  citationUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/sentinel-1/sentinel-1-how-to-cite/',
  frequency: 'C-Band',
  source: {
    name: 'ESA',
    url: 'https://www.esa.int/ESA'
  },
  productTypes: [
    {
      apiValue: 'RTC',
      displayName: 'L2 Radiometric Terrain Corrected (RTC)'
    }, {
      apiValue: 'CSLC',
      displayName: 'L2 Co-registered Single Look Complex (CSLC)'
    }, {
        apiValue: 'RTC-STATIC',
        displayName: 'L2 Radiometric Terrain Corrected Static Layer (RTC-STATIC)'
    }, {
        apiValue: 'CSLC-STATIC',
        displayName: 'L2 Co-registered Single Look Complex Static Layer (CSLC-STATIC)'
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
  platformDesc: 'OPERA_S1_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
