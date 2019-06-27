export const airsar = {
  name: 'AIRSAR',
  apiValue: { platform: 'AIRSAR' },
  date: {
    start: new Date(1990, 0, 1),
    end: new Date(2004, 0, 1)
  },
  frequency: 'L-Band, P-Band, or C-Band',
  infoUrl: 'https://www.asf.alaska.edu/sar-data/airsar/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/airsar/how-to-cite/',
  source: null,
  productTypes: [{
    apiValue: 'CTIF',
    displayName: 'C-Band JPG'
  }, {
    apiValue: 'JPG',
    displayName: 'JPG'
  }, {
    apiValue: 'ATI',
    displayName: 'Along-Track Interferometry'
  }, {
    apiValue: 'PTIF',
    displayName: 'P-Band JPG'
  }, {
    apiValue: 'LTIF',
    displayName: 'L-Band JPG'
  }, {
    apiValue: 'LSTOKES',
    displayName: 'L-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'PSTOKES',
    displayName: 'P-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'CSTOKES',
    displayName: 'C-Band DEM & Compressed Stokes Matrix'
  }, {
    apiValue: 'DEM',
    displayName: 'DEM'
  }],
  beamModes: [ '3FP', 'ATI', 'XTI' ],
  polarizations: [
    'Full'
  ]
};
