import { FeatureFlag } from '@models';

export const env = {
  prod: {
    api: 'https://api.daac.asf.alaska.edu',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://appdata.asf.alaska.edu',
    unzip: 'https://unzip.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  test: {
    api: 'https://api-test.asf.alaska.edu',
    api_maturity: 'prod',
    auth: 'https://auth.asf.alaska.edu',
    urs: 'https://urs.earthdata.nasa.gov',
    urs_client_id: 'BO_n7nTIlMljdvU6kRRB3g',
    banner: 'https://banners.asf.alaska.edu',
    user_data: 'https://cgdjuem3wc.execute-api.us-east-1.amazonaws.com/prod/',
    unzip: 'https://unzip.asf.alaska.edu',
    bulk_download: 'https://bulk-download.asf.alaska.edu',
  },
  defaultEnv: 'test',

  // Tenant configuration for standard Vertex deployment
  tenant: {
    tenant: 'vertex' as const,
    featureFlags: {
      // HyP3+ / Vertex+ Features - DISABLED for standard Vertex
      [FeatureFlag.SHOW_HYP3_PLUS_BRANDING]: false,
      [FeatureFlag.ENABLE_ENTERPRISE_API]: false,
      [FeatureFlag.SHOW_ADVANCED_PROCESSING]: false,

      // Search Features - ENABLED for standard Vertex
      [FeatureFlag.ENABLE_EVENT_SEARCH]: true,
      [FeatureFlag.ENABLE_DISPLACEMENT_SEARCH]: true,
      [FeatureFlag.ENABLE_SBAS_SEARCH]: true,
      [FeatureFlag.ENABLE_BASELINE_SEARCH]: true,
      [FeatureFlag.ENABLE_TIMESERIES_SEARCH]: true,
      [FeatureFlag.ENABLE_DERIVED_DATASETS]: true,

      // UI Features
      [FeatureFlag.SHOW_BETA_BANNER]: false,
      [FeatureFlag.ENABLE_NEW_MAP_TOOLS]: true,
      [FeatureFlag.SHOW_EXPORT_OPTIONS]: true,
      [FeatureFlag.SHOW_DOWNLOAD_QUEUE]: true,

      // API Features
      [FeatureFlag.USE_DAAC_HYP3]: true,
      [FeatureFlag.ENABLE_BULK_DOWNLOAD]: true,
      [FeatureFlag.ENABLE_CMR_SEARCH]: true,
    },
    branding: {
      appName: 'Vertex',
      orgName: 'Alaska Satellite Facility',
      supportEmail: 'uso@asf.alaska.edu',
    },
    gaMeasurementId: undefined, // Set in production if needed
  },
};
