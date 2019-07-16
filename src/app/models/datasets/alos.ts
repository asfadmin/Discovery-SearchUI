import { Props } from '../filters.model';

export const alos = {
  id: 'ALOS',
  name: 'ALOS PALSAR',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.OFF_NADIR_ANGLE,
    Props.FARADAY_ROTATION,
    Props.STACK_SIZE,
    Props.BASELINE_TOOL,
  ],
  apiValue: { platform: 'ALOS' },
  date: {
    start: new Date('2006/05/16 03:36:51 UTC'),
    end: new Date('2011/04/21 20:23:36 UTC')
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data/palsar/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/palsar/how-to-cite/',
  frequency: 'L-Band',
  source: {
    name: 'JAXA/METI',
    url: null
  },
  productTypes: [{
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    apiValue: 'RTC_HI_RES',
    displayName: 'Hi-Res Terrain Corrected'
  }, {
    apiValue: 'METADATA',
    displayName: 'XML and Log Data'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L1.5',
    displayName: 'Level 1.5 Image'
  }, {
    apiValue: 'L1.0',
    displayName: 'Level 1.0'
  }, {
    apiValue: 'RTC_LOW_RES',
    displayName: 'Low-Res Terrain Corrected'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'INTERFEROMETRY',
    displayName: '(BETA) HDF5 InSAR Product'
  }, {
    apiValue: 'L1.1',
    displayName: 'Level 1.1 Complex'
  }],
  beamModes: [],
  polarizations: [
    'HH',
    'HH 3scan',
    'HH 4scan',
    'HH 5scan',
    'HH+HV',
    'UNKNOWN',
    'VV',
    'VV+VH',
    'quadrature',
  ]
};
