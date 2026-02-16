import { Props } from '../filters.model';

export const tropo = {
  id: 'TROPO',
  name: 'TROPO',
  subName: '',
  beta: false,
  properties: [Props.DATE],
  apiValue: {
    dataset: 'TROPO',
  },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  citationUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  frequency: '',
  source: {
    name: 'OPERA-JPL',
    url: 'https://www.jpl.nasa.gov/go/opera',
  },
  productTypes: [
    {
      apiValue: 'TROPO-ZENITH',
      displayName: 'L4 Troposphere Zenith Radar Delays (TROPO-ZENITH)',
    },
    {
      apiValue: 'ECMWF_TROPO',
      displayName: 'Subset of ECMWF HRES Weather Model Data (ECMWF_TROPO)',
    },
  ],
  beamModes: [],
  polarizations: [],
  subtypes: [],
  platformDesc: 'TROPO_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    nc: 'Netcdf File',
    xml: 'Metadata XML',
    png: 'Browse Image PNG',
  },
};
