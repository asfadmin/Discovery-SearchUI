import moment from 'moment';

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
      displayName: 'DIST ALERT Products (DIST-ALERT-S1)',
    },
  ],
  beamModes: ['IW', 'EW'],
  polarizations: ['VV', 'VH', 'HH', 'HV'],
  platforms: [],
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
  description: 'OPERA_S1_DESC',
  icon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    displays: {
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
  },
};

export function getStaticQueryParams(
  productType: string,
  date: moment.Moment,
  operaBurstID: string,
) {
  return {
    processinglevel: productType + '-STATIC',
    end: date === null ? '' : moment.utc(date).format(),
    operaburstid: operaBurstID,
    dataset: opera_s1.apiValue.dataset,
    maxResults: 1,
  };
}
