import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  OnInit,
  output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Feature, getUid } from 'ol';
import { StyleLike } from 'ol/style/Style';

import * as polygonStyle from '@services/map/polygon.style';

@Component({
  selector: 'app-feature-selector',
  imports: [MatListModule, MatIconButton],
  templateUrl: './feature-selector.component.html',
  styleUrl: './feature-selector.component.scss',
})
export class FeatureSelectorComponent implements OnInit {
  private injector = inject(Injector);
  public features = input<Feature[]>();
  public callFeature = output<Feature>();
  public close = output();

  public displayedFeatures = computed(() => {
    return this.features()?.map((feature) => ({
      feature,
      id: getUid(feature),
      display: feature.get('filename') ?? `Frame ID ${feature.get('id')}`,
    }));
  });

  public featureCache = new Map<
    string,
    { feature: Feature; style: StyleLike }
  >();

  public ngOnInit(): void {
    effect(
      () => {
        if (this.features()?.length === 0) {
          for (const item of this.featureCache.values()) {
            this.hoverPreviewLeave(item.feature);
          }
        }
      },
      {
        injector: this.injector,
      },
    );
  }

  public hoverPreview(feature: Feature) {
    this.featureCache.set(getUid(feature), {
      feature,
      style: feature.getStyle(),
    });
    feature.setStyle(polygonStyle.hoverPreview);
  }

  public hoverPreviewLeave(feature: Feature) {
    const id = getUid(feature);
    const cached = this.featureCache.get(id);
    if (cached) {
      feature.setStyle(cached.style);
      this.featureCache.delete(id);
    }
  }

  public handleClick(feature: Feature) {
    this.hoverPreviewLeave(feature);
    this.callFeature.emit(feature);
  }

  public closeMenu() {
    this.close.emit();
  }
}
