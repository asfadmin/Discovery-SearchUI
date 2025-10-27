import { FeatureFlag } from './feature-flags.enum';

/**
 * Supported tenant identifiers
 */
export type Tenant = 'vertex' | 'vertex-plus';

/**
 * Branding configuration for a tenant
 */
export interface BrandingConfig {
  appName: string;
  orgName: string;
  supportEmail: string;
  logoPath?: string;
}

/**
 * Tenant-specific configuration
 *
 * This configuration defines tenant-specific behavior, feature flags,
 * and branding for each deployment variant (Vertex vs Vertex+)
 */
export interface TenantConfig {
  /** Unique identifier for the tenant */
  tenant: Tenant;

  /** Feature flags controlling tenant-specific functionality */
  featureFlags: Partial<Record<FeatureFlag, boolean>>;

  /** Branding configuration */
  branding: BrandingConfig;

  /** Optional Google Analytics measurement ID */
  gaMeasurementId?: string;
}
