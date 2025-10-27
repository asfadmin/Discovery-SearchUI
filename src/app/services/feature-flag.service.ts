import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { FeatureFlag } from '@models';

/**
 * Service for checking feature flags in a type-safe manner.
 *
 * Feature flags control tenant-specific functionality and allow
 * different behavior between Vertex and Vertex+ deployments.
 *
 * @example
 * ```typescript
 * if (this.featureFlags.isEnabled(FeatureFlag.SHOW_HYP3_PLUS_BRANDING)) {
 *   // Show Vertex+ branding
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  constructor(private envService: EnvironmentService) {}

  /**
   * Check if a feature flag is enabled for the current tenant
   *
   * @param flag - Feature flag to check
   * @param defaultValue - Default value if flag not found (default: false)
   * @returns true if the flag is enabled, false otherwise
   */
  isEnabled(flag: FeatureFlag, defaultValue = false): boolean {
    const tenantConfig = this.envService.tenantConfig;

    if (!tenantConfig || !tenantConfig.featureFlags) {
      return defaultValue;
    }

    return tenantConfig.featureFlags[flag] ?? defaultValue;
  }

  /**
   * Check if all specified flags are enabled (AND operation)
   *
   * @param flags - Feature flags to check
   * @returns true if all flags are enabled, false otherwise
   */
  areAllEnabled(...flags: FeatureFlag[]): boolean {
    return flags.every((flag) => this.isEnabled(flag));
  }

  /**
   * Check if any of the specified flags are enabled (OR operation)
   *
   * @param flags - Feature flags to check
   * @returns true if any flag is enabled, false otherwise
   */
  isAnyEnabled(...flags: FeatureFlag[]): boolean {
    return flags.some((flag) => this.isEnabled(flag));
  }

  /**
   * Get all enabled feature flags for the current tenant
   *
   * @returns Array of enabled feature flag values
   */
  getEnabledFlags(): FeatureFlag[] {
    const tenantConfig = this.envService.tenantConfig;

    if (!tenantConfig || !tenantConfig.featureFlags) {
      return [];
    }

    return Object.entries(tenantConfig.featureFlags)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key as FeatureFlag);
  }

  /**
   * Get all feature flags and their values for the current tenant
   *
   * @returns Record of all feature flags with their boolean values
   */
  getAllFlags(): Partial<Record<FeatureFlag, boolean>> {
    const tenantConfig = this.envService.tenantConfig;
    return tenantConfig?.featureFlags ?? {};
  }
}
