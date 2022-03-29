import { Props } from '../filters.model';

export const avnir = {
  id: 'AVNIR',
  name: 'ALOS AVNIR-2',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.ABSOLUTE_ORBIT,
    Props.POINTING_ANGLE,
  ],
  apiValue: { platform: 'ALOS', instrument: 'AVNIR-2' },
  date: {
    start: new Date('2006/05/16 03:36:51 UTC'),
    end: new Date('2011/04/21 20:23:36 UTC')
  },
  infoUrl: 'https://asf.alaska.edu/datasets/optical-data-sets/alos-avnir-2-ortho-rectified-image-product/',
  citationUrl: 'https://www.asf.alaska.edu/how-to-cite-data/',
  frequency: 'Visible and Near Infrared',
  source: {
    name: 'JAXA',
    url: 'https://global.jaxa.jp/'
  },
  productTypes: [
    {
      apiValue: 'L2',
      displayName: 'Ortho Rectified Image'
    },
  ],
  beamModes: ['OBS'],
  polarizations: [],
  subtypes: [],
};
