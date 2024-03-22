import { Props } from '../filters.model';

export const nisar = {
  id: 'NISAR',
  name: 'NISAR',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    // Props.BEAM_MODE,
    // Props.FLIGHT_DIRECTION,
    // Props.POLARIZATION,
    // Props.ABSOLUTE_ORBIT,
    // Props.BASELINE_TOOL,
    // Props.SUBTYPE,
    Props.PATH,
  ],
  apiValue: { dataset: 'NISAR' },
  date: { start: new Date('2024/01/01 03:44:43 UTC') },
  infoUrl: 'https://nisar.jpl.nasa.gov',
  citationUrl: 'https://asf.alaska.edu/nisar/',
  frequency: 'L-Band',
  source: {
    name: 'JPL',
    url: 'https://nisar.jpl.nasa.gov'
  },
  productTypes: [
    // {
    //   apiValue: 'BURST',
    //   displayName: 'SLC Burst (BURST)'
    // }
  ],
  beamModes: [
    // 'IW', 'EW'
  ],
  polarizations: [
    // 'VV',
    // 'HH',
    // 'HV',
    // 'VH'
  ],
  subtypes: [
    //     {
    //     displayName: 'Sentinel-1A',
    //     apiValue: 'SA',
    //   }, {
    //     displayName: 'Sentinel-1B',
    //     apiValue: 'SB',
    //   }
  ],
  shortNames: [
    {
      displayName: "NISAR Beta NEN Science Telemetry Data (Version 1)",
      apiValue: "NISAR_NEN_RRST_BETA_V1"
    },
    {
      displayName: "NISAR Provisional NEN Science Telemetry Data (Version 1)",
      apiValue: "NISAR_NEN_RRST_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR NEN Science Telemetry Data (Version 1)",
      apiValue: "NISAR_NEN_RRST_V1"
    },
    {
      displayName: "NISAR Beta Level 0A Science Telemetry Data (Version 1)",
      apiValue: "NISAR_L0A_RRST_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Level 0A Science Telemetry Data (Version 1)",
      apiValue: "NISAR_L0A_RRST_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Level 0A Science Telemetry Data (Version 1)",
      apiValue: "NISAR_L0A_RRST_V1"
    },
    {
      displayName: "NISAR Beta Radar Raw Signal Science Data (Version 1)",
      apiValue: "NISAR_L0B_RRSD_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Radar Raw Signal Science Data (Version 1)",
      apiValue: "NISAR_L0B_RRSD_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Radar Raw Signal Science Data (Version 1)",
      apiValue: "NISAR_L0B_RRSD_V1"
    },
    {
      displayName: "NISAR Beta Radar Raw Signal Calibration Data (Version 1)",
      apiValue: "NISAR_L0B_CRSD_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Radar Raw Signal Calibration Data (Version 1)",
      apiValue: "NISAR_L0B_CRSD_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Radar Raw Signal Calibration Data (Version 1)",
      apiValue: "NISAR_L0B_CRSD_V1"
    },
    {
      displayName: "NISAR Beta Range Doppler Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L1_RSLC_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Range Doppler Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L1_RSLC_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Range Doppler Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L1_RSLC_V1"
    },
    {
      displayName: "NISAR Beta Range Doppler Wrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RIFG_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Range Doppler Wrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RIFG_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Range Doppler Wrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RIFG_V1"
    },
    {
      displayName: "NISAR Beta Range Doppler Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RUNW_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Range Doppler Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RUNW_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Range Doppler Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L1_RUNW_V1"
    },
    {
      displayName: "NISAR Beta Range Doppler Pixel Offsets (Version 1)",
      apiValue: "NISAR_L1_ROFF_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Range Doppler Pixel Offsets (Version 1)",
      apiValue: "NISAR_L1_ROFF_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Range Doppler Pixel Offsets (Version 1)",
      apiValue: "NISAR_L1_ROFF_V1"
    },
    {
      displayName: "NISAR Beta Geocoded Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L2_GSLC_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Geocoded Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L2_GSLC_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Geocoded Single Look Complex Product (Version 1)",
      apiValue: "NISAR_L2_GSLC_V1"
    },
    {
      displayName: "NISAR Beta Geocoded Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L2_GUNW_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Geocoded Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L2_GUNW_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Geocoded Unwrapped Interferogram Product (Version 1)",
      apiValue: "NISAR_L2_GUNW_V1"
    },
    {
      displayName: "NISAR Beta Geocoded Polarimetric Covariance Product (Version 1)",
      apiValue: "NISAR_L2_GCOV_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Geocoded Polarimetric Covariance Product (Version 1)",
      apiValue: "NISAR_L2_GCOV_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Geocoded Polarimetric Covariance Product (Version 1)",
      apiValue: "NISAR_L2_GCOV_V1"
    },
    {
      displayName: "NISAR Beta Geocoded Pixel Offsets (Version 1)",
      apiValue: "NISAR_L2_GOFF_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Geocoded Pixel Offsets (Version 1)",
      apiValue: "NISAR_L2_GOFF_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Geocoded Pixel Offsets (Version 1)",
      apiValue: "NISAR_L2_GOFF_V1"
    },
    {
      displayName: "NISAR Beta Soil Moisture (Version 1)",
      apiValue: "NISAR_L3_SME2_BETA_V1"
    },
    {
      displayName: "NISAR Provisional Soil Moisture (Version 1)",
      apiValue: "NISAR_L3_SME2_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Validated Soil Moisture (Version 1)",
      apiValue: "NISAR_L3_SME2_V1"
    },
    {
      displayName: "NISAR Provisional Custom Products",
      apiValue: "NISAR_CUSTOM_PROVISIONAL_V1"
    },
    {
      displayName: "NISAR Urgent Response Radar Raw Signal Science Data",
      apiValue: "NISAR_UR_L0B_RRSD"
    },
    {
      displayName: "NISAR Urgent Response Level 1 Product",
      apiValue: "NISAR_UR_L1"
    },
    {
      displayName: "NISAR Urgent Response Level 2 Product",
      apiValue: "NISAR_UR_L2"
    },
    {
      displayName: "NISAR Ancillary and Auxiliary Data",
      apiValue: "NISAR_ANC_AUX"
    },
    {
      displayName: "NISAR LSAR External Calibration File",
      apiValue: "NISAR_LSAR_EXT_CAL"
    },
    {
      displayName: "NISAR LSAR Internal Calibration File",
      apiValue: "NISAR_LSAR_INT_CAL"
    },
  ],
  platformDesc: 'NISAR_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
};
