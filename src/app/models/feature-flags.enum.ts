/**
 * Feature flags for tenant-specific functionality
 *
 * Use these enum values to check if features are enabled for the current tenant.
 * All feature flags should be defined here for type safety and autocomplete.
 */
export enum FeatureFlag {
  // HyP3+ / Vertex+ Features
  SHOW_HYP3_PLUS_BRANDING = 'showHyp3PlusBranding',
  ENABLE_ENTERPRISE_API = 'enableEnterpriseApi',
  SHOW_ADVANCED_PROCESSING = 'showAdvancedProcessing',

  // Search Features
  ENABLE_EVENT_SEARCH = 'enableEventSearch',
  ENABLE_DISPLACEMENT_SEARCH = 'enableDisplacementSearch',
  ENABLE_SBAS_SEARCH = 'enableSbasSearch',
  ENABLE_BASELINE_SEARCH = 'enableBaselineSearch',
  ENABLE_TIMESERIES_SEARCH = 'enableTimeseriesSearch',
  ENABLE_DERIVED_DATASETS = 'enableDerivedDatasets',

  // UI Features
  SHOW_BETA_BANNER = 'showBetaBanner',
  ENABLE_NEW_MAP_TOOLS = 'enableNewMapTools',
  SHOW_EXPORT_OPTIONS = 'showExportOptions',
  SHOW_DOWNLOAD_QUEUE = 'showDownloadQueue',

  // API Features
  USE_DAAC_HYP3 = 'useDaacHyp3',
  ENABLE_BULK_DOWNLOAD = 'enableBulkDownload',
  ENABLE_CMR_SEARCH = 'enableCmrSearch',
}
