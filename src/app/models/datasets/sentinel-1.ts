import { Props } from '../filters.model';

export const sentinel_1 = {
  id: 'SENTINEL-1',
  name: 'Sentinel-1',
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.BASELINE_TOOL,
  ],
  apiValue: { platform: 'SENTINEL-1' },
  date: { start: new Date('2014/06/15 03:44:43 UTC') },
  infoUrl: 'https://www.asf.alaska.edu/sentinel/',
  citationUrl: 'https://www.asf.alaska.edu/sentinel/how-to-cite/',
  frequency: 'C-Band',
  source: {
    name: 'ESA',
    url: 'http://www.esa.int/ESA'
  },
  productTypes: [
    {
      apiValue: 'GRD_HD',
      displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
    },
    {
      apiValue: 'GRD_MD',
      displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)'
    },
    {
      apiValue: 'GRD_MS',
      displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)'
    },
    {
      apiValue: 'GRD_HS',
      displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)'
    },
    {
      apiValue: 'SLC',
      displayName: 'L1 Single Look Complex (SLC)'
    },
    {
      apiValue: 'OCN',
      displayName: 'L2 Ocean (OCN)'
    },
    {
      apiValue: 'RAW',
      displayName: 'L0 Raw Data (RAW)'
    },
    {
      apiValue: 'METADATA_GRD_MS',
      displayName: 'XML Metadata (GRD-MS)'
    },
    {
      apiValue: 'METADATA_GRD_FD',
      displayName: 'XML Metadata (GRD-FD)'
    },
    {
      apiValue: 'METADATA_GRD_HD',
      displayName: 'XML Metadata (GRD-HD)'
    },
    {
      apiValue: 'METADATA_RAW',
      displayName: 'XML Metadata (RAW)'
    },
    {
      apiValue: 'METADATA_GRD_HS',
      displayName: 'XML Metadata (GRD-HS)'
    },
    {
      apiValue: 'METADATA_GRD_MD',
      displayName: 'XML Metadata (GRD-MD)'
    },
    {
      apiValue: 'METADATA_SLC',
      displayName: 'XML Metadata (SLC)'
    },
    {
      apiValue: 'METADATA_OCN',
      displayName: 'XML Metadata (OCN)'
    },
  ],
  beamModes: [
    'IW', 'EW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ],
  polarizations: [
    'VV+VH',
    'HH+HV',
    'VV',
    'HH',
    'Dual HH',
    'Dual HV',
    'Dual VH',
    'Dual VV',
  ]
};
