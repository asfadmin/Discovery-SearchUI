import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { FeatureFlagService } from '@services/feature-flag.service';
import { FeatureFlag } from '@models';

/**
 * Route guard factory for protecting routes based on feature flags.
 *
 * This functional guard checks if a specific feature flag is enabled
 * for the current tenant. If disabled, it redirects to the home page.
 *
 * @param flag - Feature flag to check
 * @param redirectTo - Optional path to redirect to if flag is disabled (default: '/')
 * @returns CanActivateFn guard function
 *
 * @example
 * ```typescript
 * const routes: Routes = [
 *   {
 *     path: 'advanced-processing',
 *     component: AdvancedProcessingComponent,
 *     canActivate: [featureFlagGuard(FeatureFlag.SHOW_ADVANCED_PROCESSING)]
 *   }
 * ];
 * ```
 */
export function featureFlagGuard(
  flag: FeatureFlag,
  redirectTo: string = '/'
): CanActivateFn {
  return () => {
    const featureFlags = inject(FeatureFlagService);
    const router = inject(Router);

    if (featureFlags.isEnabled(flag)) {
      return true;
    }

    // Redirect to specified path if feature not enabled
    return router.createUrlTree([redirectTo]);
  };
}

/**
 * Route guard factory that requires ALL specified flags to be enabled.
 *
 * @param flags - Feature flags that must all be enabled
 * @param redirectTo - Optional path to redirect to if any flag is disabled (default: '/')
 * @returns CanActivateFn guard function
 *
 * @example
 * ```typescript
 * canActivate: [requireAllFlags(
 *   FeatureFlag.ENABLE_ENTERPRISE_API,
 *   FeatureFlag.SHOW_ADVANCED_PROCESSING
 * )]
 * ```
 */
export function requireAllFlags(
  ...flags: FeatureFlag[]
): CanActivateFn;
export function requireAllFlags(
  redirectTo: string,
  ...flags: FeatureFlag[]
): CanActivateFn;
export function requireAllFlags(
  flagOrRedirect: FeatureFlag | string,
  ...flags: FeatureFlag[]
): CanActivateFn {
  const redirectTo = typeof flagOrRedirect === 'string' ? flagOrRedirect : '/';
  const allFlags = typeof flagOrRedirect === 'string' ? flags : [flagOrRedirect, ...flags];

  return () => {
    const featureFlags = inject(FeatureFlagService);
    const router = inject(Router);

    if (featureFlags.areAllEnabled(...allFlags)) {
      return true;
    }

    return router.createUrlTree([redirectTo]);
  };
}

/**
 * Route guard factory that requires ANY of the specified flags to be enabled.
 *
 * @param flags - Feature flags where at least one must be enabled
 * @param redirectTo - Optional path to redirect to if no flags are enabled (default: '/')
 * @returns CanActivateFn guard function
 *
 * @example
 * ```typescript
 * canActivate: [requireAnyFlag(
 *   FeatureFlag.ENABLE_EVENT_SEARCH,
 *   FeatureFlag.ENABLE_DISPLACEMENT_SEARCH
 * )]
 * ```
 */
export function requireAnyFlag(
  ...flags: FeatureFlag[]
): CanActivateFn;
export function requireAnyFlag(
  redirectTo: string,
  ...flags: FeatureFlag[]
): CanActivateFn;
export function requireAnyFlag(
  flagOrRedirect: FeatureFlag | string,
  ...flags: FeatureFlag[]
): CanActivateFn {
  const redirectTo = typeof flagOrRedirect === 'string' ? flagOrRedirect : '/';
  const allFlags = typeof flagOrRedirect === 'string' ? flags : [flagOrRedirect, ...flags];

  return () => {
    const featureFlags = inject(FeatureFlagService);
    const router = inject(Router);

    if (featureFlags.isAnyEnabled(...allFlags)) {
      return true;
    }

    return router.createUrlTree([redirectTo]);
  };
}
