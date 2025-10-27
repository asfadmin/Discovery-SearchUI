import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FeatureFlagService } from '@services/feature-flag.service';
import { FeatureFlag } from '@models';

/**
 * Structural directive for conditionally rendering content based on feature flags.
 *
 * This standalone directive allows you to show/hide template content based on
 * whether a feature flag is enabled for the current tenant.
 *
 * @example
 * ```html
 * <!-- Show content only if flag is enabled -->
 * <div *appFeatureFlag="FeatureFlag.SHOW_HYP3_PLUS_BRANDING">
 *   <h1>Welcome to Vertex+</h1>
 * </div>
 *
 * <!-- Show alternate content if flag is disabled -->
 * <ng-container *appFeatureFlag="FeatureFlag.ENABLE_NEW_MAP_TOOLS; else oldTools">
 *   <app-new-map-tools></app-new-map-tools>
 * </ng-container>
 * <ng-template #oldTools>
 *   <app-legacy-map-tools></app-legacy-map-tools>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[appFeatureFlag]',
  standalone: true,
})
export class FeatureFlagDirective implements OnInit {
  /**
   * The feature flag to check
   */
  @Input() appFeatureFlag!: FeatureFlag;

  /**
   * Optional template to render if the feature flag is disabled
   */
  @Input() appFeatureFlagElse?: TemplateRef<any>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private featureFlagService: FeatureFlagService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const isEnabled = this.featureFlagService.isEnabled(this.appFeatureFlag);

    this.viewContainer.clear();

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else if (this.appFeatureFlagElse) {
      this.viewContainer.createEmbeddedView(this.appFeatureFlagElse);
    }
  }
}
