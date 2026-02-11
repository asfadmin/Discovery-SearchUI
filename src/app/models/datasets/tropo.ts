import { Props } from '../filters.model';

export const tropo = {
  id: 'TROPO',
  name: 'TROPO',
  subName: '',
  beta: false,
  priority: 10,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
  ],
  apiValue: {
    dataset: 'OPERA-S1',
  },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl:
    'https://www.earthdata.nasa.gov/news/nasas-opera-project-releases-troposphere-zenith-radar-delays-dataset',
  citationUrl:
    'https://www.earthdata.nasa.gov/news/nasas-opera-project-releases-troposphere-zenith-radar-delays-dataset',
  frequency: 'C-Band',
  source: {
    name: 'OPERA-JPL',
    url: 'https://www.jpl.nasa.gov/go/opera',
  },
  productTypes: [],
  defaultProductTypes: [
    {
      apiValue: 'TROPO-ZENITH',
      displayName: 'L4 Troposphere Zenith Radar Delays (TROPO-ZENITH)',
    },
  ],
  beamModes: ['IW', 'EW'],
  polarizations: ['VV', 'HH', 'HV', 'VH'],
  subtypes: [],
  platformDesc: 'TROPO_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
