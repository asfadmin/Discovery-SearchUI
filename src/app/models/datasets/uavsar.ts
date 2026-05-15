import { Props } from '../filters.model';

export const uavsar = {
  id: 'UAVSAR',
  name: 'UAVSAR',
  subName: '',
  beta: false,
  properties: [Props.DATE, Props.MISSION_NAME],
  apiValue: { dataset: 'UAVSAR' },
  date: { start: new Date('2008/04/28 21:10:16 UTC') },
  infoUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/',
  citationUrl:
    'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/#uavsar_cite',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/',
  },
  productTypes: [
    {
      apiValue: 'POLSAR',
      displayName: 'Polarimetric Synthetic Aperture Radar (POLSAR)',
    },
    {
      apiValue: 'RPI',
      displayName: 'Repeat Pass Interferometry (RPI)',
    },
  ],
  beamModes: [],
  polarizations: [],
  subtypes: [],
  platformDesc: 'UAVSAR_DESC',
  platformIcon: '/assets/icons/flight_black_48dp.svg',
  productTypeDisplays: {
    gif: '_gif',
    mlc: 'Multi-look Complex',
    grd: 'Ground Projected Complex',
    end: 'Figure out',
    ann: 'Annotation file / Metadata',
    dat: '_dat',
    hgt: 'GEOTIFF Height File',
    inc: 'Incidence Angle',
    kmz: 'GoogleEarth KMZ',
    slope: 'Slope',
    int: 'Interferogram',
    unw: '_unw',
    cor: '_cor',
    amp1: 'Amplitude 1',
    amp2: 'Amplitude 2',
  },
};
