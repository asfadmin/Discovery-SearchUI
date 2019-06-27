export const beta = {
  name: 'S1 BETA',
  apiValue: { asfplatform: 'SENTINEL-1 INTERFEROGRAM (BETA)' },
  date: { start: new Date(2014, 3, 25) },
  infoUrl: 'https://www.asf.alaska.edu/sentinel/',
  citationUrl: 'https://www.asf.alaska.edu/sentinel/how-to-cite/',
  frequency: 'C-Band',
  source: {
    name: 'ESA',
    url: 'http://www.esa.int/ESA'
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
  beamModes: [ ],
  polarizations: [ ]
};
