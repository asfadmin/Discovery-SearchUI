import { Props } from '../filters.model';

export const beta = {
  id: 'SENTINEL-1 INTERFEROGRAM (BETA)',
  name: 'ARIA S1 GUNW',
  subName: 'NISAR-format',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.MISSION_NAME,
    Props.ABSOLUTE_ORBIT,
  ],
  apiValue: { datasets: 'ARIA S1 GUNW' },
  date: { start: new Date(2014, 3, 25) },
  infoUrl: 'https://asf.alaska.edu/data-sets/derived-data-sets/sentinel-1-interferograms/',
  citationUrl: 'https://asf.alaska.edu/data-sets/derived-data-sets/sentinel-1-interferograms/#citation',
  frequency: 'C-Band',
  source: {
    name: 'ARIA-JPL',
    url: 'https://aria.jpl.nasa.gov/'
  },
  productTypes: [
    {
      apiValue: 'GUNW_STD',
      displayName: 'Standard Product, NetCDF'
    },
    {
      apiValue: 'GUNW_AMP',
      displayName: 'Amplitude, GeoTIFF'
    },
    {
      apiValue: 'GUNW_CON',
      displayName: 'Connected Components, GeoTIFF'
    },
    {
      apiValue: 'GUNW_COH',
      displayName: 'Coherence, GeoTIFF'
    },
    {
      apiValue: 'GUNW_UNW',
      displayName: 'Unwrapped Phase, GeoTIFF'
    },
  ],
  beamModes: ['slc'],
  polarizations: ['VV'],
  subtypes: [],
  platformDesc: 'SENTINEL_1_INTERFEROGRAM_BETA_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
