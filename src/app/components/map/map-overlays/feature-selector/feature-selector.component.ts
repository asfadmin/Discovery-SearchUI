import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { Feature, getUid } from 'ol';
import { StyleLike } from 'ol/style/Style';

import { DisplayedFeature, FeatureType, SearchType } from '@models';
import { MapService, ScenesService } from '@services';
import * as polygonStyle from '@services/map/polygon.style';
import { getSearchType } from '@store/search';

@Component({
  selector: 'app-feature-selector',
  imports: [
    MatListModule,
    MatIcon,
    MatIconButton,
    TranslatePipe,
    CdkDragHandle,
  ],
  templateUrl: './feature-selector.component.html',
  styleUrl: './feature-selector.component.scss',
})
export class FeatureSelectorComponent {
  public features = input.required<Feature[]>();
  public callFeature = output<Feature>();
  public close = output();
  private sceneService = inject(ScenesService);
  private store = inject(Store);
  private mapService = inject(MapService);

  private scenes = toSignal(this.sceneService.scenes$);
  public searchType = this.store.selectSignal(getSearchType);

  public displayedFeatures = computed<DisplayedFeature[]>(() => {
    return this.features()
      ?.map((feature) => this.getDisplayFor(feature))
      .reverse();
  });

  public featureCache = new Map<
    string,
    { feature: Feature; style: StyleLike }
  >();
  public searchTypes = SearchType;

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

  private getDisplayFor(feature: Feature): DisplayedFeature {
    let description: string;
    let display: string;
    const featureType = this.mapService.getFeatureType(feature);
    if (featureType === FeatureType.SCENE) {
      description = this.scenes()
        .find((x) => x.name === feature.get('filename'))
        ?.metadata?.date.toString();
      display = feature.get('filename');
    }

    if (featureType === FeatureType.FRAME) {
      description = `Track: ${feature.get('path')}`;
      display = `Frame ID ${feature.get('id')}`;
    }

    return {
      feature: feature,
      id: getUid(feature),
      display: display,
      description: description,
    };
  }

  public closeMenu() {
    this.close.emit();
  }
}
