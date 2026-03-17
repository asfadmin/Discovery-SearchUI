import { Props } from '../filters.model';

export const opera_s1 = {
  id: 'OPERA-S1',
  name: 'OPERA-S1',
  subName: '',
  beta: false,
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
  infoUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  citationUrl: 'https://asf.alaska.edu/datasets/daac/opera/',
  frequency: 'C-Band',
  source: {
    name: 'OPERA-JPL',
    url: 'https://www.jpl.nasa.gov/go/opera',
  },
  productTypes: [
    {
      apiValue: 'RTC',
      displayName: 'L2 Radiometric Terrain Corrected (RTC)',
    },
    {
      apiValue: 'CSLC',
      displayName: 'L2 Co-registered Single Look Complex (CSLC)',
    },
    {
      apiValue: 'RTC-STATIC',
      displayName: 'L2 Radiometric Terrain Corrected Static Layer (RTC-STATIC)',
    },
    {
      apiValue: 'CSLC-STATIC',
      displayName:
        'L2 Co-registered Single Look Complex Static Layer (CSLC-STATIC)',
    },
    {
      apiValue: 'DISP-S1',
      displayName: 'L3 Surface Displacement (DISP-S1)',
    },
    {
      apiValue: 'DISP-S1-STATIC',
      displayName:
        'L3 Co-registered Surface Displacement Static Layer (DISP-S1-STATIC)',
    },
    {
      apiValue: 'DIST-ALERT-S1',
      displayName: 'DIST ALERT Products',
    },
  ],
  beamModes: ['IW', 'EW'],
  polarizations: ['VV', 'HH', 'HV', 'VH'],
  subtypes: [],
  calibrationDatasets: ['OPERA-S1-CALVAL'],
  calibrationProductTypes: [
    {
      apiValue: 'RTC',
      displayName: 'L2 Radiometric Terrain Corrected (RTC)',
    },
    {
      apiValue: 'CSLC',
      displayName: 'L2 Co-registered Single Look Complex (CSLC)',
    },
  ],
  platformDesc: 'OPERA_S1_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    hh: 'HH GeoTIFF',
    hv: 'HV GeoTIFF',
    vv: 'VV GeoTIFF',
    vh: 'VH GeoTIFF',
    mask: 'Mask GeoTIFF',
    nc: 'Netcdf File',
    h5: 'HDF5',
    xml: 'Metadata XML',
    rtc_anf_gamma0_to_sigma0: 'RTC Gamma to Sigma GeoTIFF',
    number_of_looks: '# of Looks GeoTIFF',
    incidence_angle: 'Incidence Angle GeoTIFF',
    rtc_anf_gamma0_to_beta0: 'RTC Gamm to Beta GeoTIFF',
    local_incidence_angle: 'Local Incidence Angle GeoTIFF',
    dem: 'DEM GeoTIFF',
  },
};
