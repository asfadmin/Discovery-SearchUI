import { Props } from '../filters.model';

export const sirc = {
  id: 'SIR-C',
  name: 'SIR-C',
  subName: '',
  beta: true,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.SUBTYPE,
  ],
  apiValue: { platform: 'SIR-C' },
  date: {
    start: new Date('1994/04/09 11:05:00 UTC'),
    end: new Date('1994/10/11 17:02:09 UTC')
  },
  infoUrl: 'https://eospso.nasa.gov/missions/spaceborne-imaging-radar-c',
  citationUrl: 'https://asf.alaska.edu/information/how-to-cite-data/',
  frequency: 'C-Band and L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/'
  },
  productTypes: [
    {
      apiValue: 'SLC',
      displayName: 'SIR-C SLC data product'
    },
    {
      apiValue: 'GRD',
      displayName: 'SIR-C GRD data product'
    },
  ],
  beamModes: [
    '11', '13', '16', '20',
  ],
  polarizations: [
    'HH+HV',
    'HH+VV',
    'HH+HV+VH+VV',
    'VV'
  ],
  subtypes: [{
    displayName: '',
    apiValue: 'STS-59',
  }, {
    displayName: '',
    apiValue: 'STS-68',
  }],
  platformDesc: 'SIRC_DESC',
  platformIcon: '/assets/icons/rocket_black_48dp.svg',

};
