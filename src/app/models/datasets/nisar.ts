import { Props } from '../filters.model';

export const nisar = {
  id: 'NISAR',
  name: 'NISAR',
  subName: '',
  beta: false,
  properties: [
    Props.DATE,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.PATH,
    Props.FRAME,
    Props.SIDE_POLARIZATION,
    Props.RANGE_BANDWIDTH,
    Props.COVERAGE_ANGLE,
    Props.USE_TRACK,
    Props.INSTRUMENT,
  ],
  apiValue: { dataset: 'NISAR' },
  date: { start: new Date('2025/08/02 03:44:43 UTC') },
  defaultFilters: {
    productionConfig: ['PR'],
  },
  infoUrl: 'https://nisar-docs.asf.alaska.edu/',
  citationUrl: 'https://asf.alaska.edu/nisar/',
  frequency: 'L-Band',
  source: {
    name: 'NASA/JPL',
    url: 'https://nisar.jpl.nasa.gov',
  },
  collectionMap: {
    NISAR_L0A_RRST_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0a-rrst-beta-v1-1',
    NISAR_L0A_RRST_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0a-rrst-provisional-v1-1',
    NISAR_L0A_RRST_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0a-rrst-v1-1',
    NISAR_L0B_CRSD_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-crsd-beta-v1-1',
    NISAR_L0B_CRSD_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-crsd-provisional-v1-1',
    NISAR_L0B_CRSD_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-crsd-v1-1',
    NISAR_L0B_RRSD_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-rrsd-beta-v1-1',
    NISAR_L0B_RRSD_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-rrsd-provisional-v1-1',
    NISAR_L0B_RRSD_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l0b-rrsd-v1-1',
    NISAR_L1_RIFG_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rifg-beta-v1-1',
    NISAR_L1_RIFG_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rifg-provisional-v1-1',
    NISAR_L1_RIFG_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rifg-v1-1',
    NISAR_L1_ROFF_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-roff-beta-v1-1',
    NISAR_L1_ROFF_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-roff-provisional-v1-1',
    NISAR_L1_ROFF_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-roff-v1-1',
    NISAR_L1_RSLC_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rslc-beta-v1-1',
    NISAR_L1_RSLC_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rslc-provisional-v1-1',
    NISAR_L1_RSLC_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-rslc-v1-1',
    NISAR_L1_RUNW_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-runw-beta-v1-1',
    NISAR_L1_RUNW_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-runw-provisional-v1-1',
    NISAR_L1_RUNW_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l1-runw-v1-1',
    NISAR_L2_GCOV_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gcov-beta-v1-1',
    NISAR_L2_GCOV_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gcov-provisional-v1-1',
    NISAR_L2_GCOV_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gcov-v1-1',
    NISAR_L2_GOFF_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-goff-beta-v1-1',
    NISAR_L2_GOFF_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-goff-provisional-v1-1',
    NISAR_L2_GOFF_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-goff-v1-1',
    NISAR_L2_GSLC_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gslc-beta-v1-1',
    NISAR_L2_GSLC_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gslc-provisional-v1-1',
    NISAR_L2_GSLC_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gslc-v1-1',
    NISAR_L2_GUNW_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gunw-beta-v1-1',
    NISAR_L2_GUNW_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gunw-provisional-v1-1',
    NISAR_L2_GUNW_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-gunw-v1-1',
    NISAR_L2_STATIC_LAYERS:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l2-static-layers-1',
    NISAR_L3_SME2_BETA_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l3-sme2-beta-v1-1',
    NISAR_L3_SME2_PROVISIONAL_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l3-sme2-provisional-v1-1',
    NISAR_L3_SME2_V1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-l3-sme2-v1-1',
    NISAR_LRCLK_UTC:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-lrclk-utc-1',
    NISAR_OE: 'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-oe-1',
    NISAR_OROST:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-orost-1',
    NISAR_RP: 'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-rp-1',
    NISAR_STUF: 'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-stuf-1',
    NISAR_TEC: 'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-tec-1',
    NISAR_UR_L0B_RRSD:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-ur-l0b-rrsd-1',
    NISAR_UR_L1:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-ur-l1-1',
    NISAR_UR_L2:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-ur-l2-1',
    NISAR_ANC_AUX:
      'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-anc-aux-1',
    NISAR_COP: 'https://www.earthdata.nasa.gov/data/catalog/asf-nisar-cop-1',
  },
  productTypes: [],
  beamModes: [],
  polarizations: [
    'HH',
    'HH,HV',
    'HH,VV',
    'HH,HV,VH,VV',
    'VV',
    'VV,VH',
    'RH,RV',
    'LH,LV',
  ],
  sidepolarizations: [
    'HH',
    'HH,HV',
    'HH,HV,VH,VV',
    'VV',
    'VV,VH',
    'RH,RV',
    'LH,LV',
  ],
  bandwidth: {
    'L-Band': ['20', '40', '20+5', '40+5', '77', '5', '5+5'],
  },
  instruments: [
    {
      displayName: 'L-Band SAR',
      apiValue: 'L-SAR',
    },
  ],
  platforms: [],
  description: 'NISAR_DESC',
  icon: '/assets/icons/satellite_alt_black_48dp.svg',

  productTypeDisplays: {
    yaml: 'Runconfig YAML',
    kml: 'Footprint KML',
    png: 'Browse Image PNG',
    csv: 'QA Summary CSV',
    h5: 'HDF5',
    xml: 'ISO Metadata XML',
    json: 'Metadata JSON',
    pdf: 'QA Report PDF',
    log: 'Log File',
    qa: 'QA Statistics HDF5',
    bin: 'Bin File',
  },
  productTypeGroups: {
    Metadata: ['Runconfig YAML', 'Footprint KML'],
    Visualizations: ['Browse Image PNG'],
    Documentation: ['Log File'],
  },
};

export const L1L2BrowseCollectionMapping = {
  RSLC: { collection: 'NISAR_L2_GSLC', productType: 'GSLC' },
  RUNW: { collection: 'NISAR_L2_GUNW', productType: 'GUNW' },
  ROFF: { collection: 'NISAR_L2_GOFF', productType: 'GOFF' },
};
