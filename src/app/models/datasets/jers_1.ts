export const jers_1 = {
  name: 'JERS-1',
  apiValue: { platform: 'JERS-1' },
  date: {
    start: new Date(1992, 0, 1),
    end: new Date(1998, 0, 1)
  },
  frequency: 'L-Band',
  source: {
    name: 'JAXA',
    url: 'https://global.jaxa.jp/'
  },
  infoUrl: 'https://www.asf.alaska.edu/sar-data/jers-1/',
  citationUrl: 'https://www.asf.alaska.edu/sar-data/jers-1/how-to-cite/',
  productTypes: [{
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ]
};
