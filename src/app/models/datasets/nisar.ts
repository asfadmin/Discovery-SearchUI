import { Props } from '../filters.model';

export const nisar = {
  id: 'NISAR',
  name: 'NISAR',
  subName: '',
  beta: true,
  properties: [
    Props.DATE,
    // Props.BEAM_MODE,
    // Props.FLIGHT_DIRECTION,
    // Props.POLARIZATION,
    // Props.ABSOLUTE_ORBIT,
    // Props.BASELINE_TOOL,
    // Props.SUBTYPE,
    // Props.PATH,
  ],
  apiValue: { dataset: 'NISAR' },
  date: { start: new Date('2024/01/01 03:44:43 UTC') },
  infoUrl: 'https://nisar.jpl.nasa.gov',
  citationUrl: 'https://asf.alaska.edu/nisar/',
  frequency: 'L-Band',
  source: {
    name: 'JPL',
    url: 'https://nisar.jpl.nasa.gov'
  },
  productTypes: [
    // {
    //   apiValue: 'BURST',
    //   displayName: 'SLC Burst (BURST)'
    // }
  ],
  beamModes: [
    // 'IW', 'EW'
  ],
  polarizations: [
    // 'VV',
    // 'HH',
    // 'HV',
    // 'VH'
  ],
  subtypes: [
//     {
//     displayName: 'Sentinel-1A',
//     apiValue: 'SA',
//   }, {
//     displayName: 'Sentinel-1B',
//     apiValue: 'SB',
//   }
],
  platformDesc: 'NISAR_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
