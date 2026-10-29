import { SlicePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatActionList } from '@angular/material/list';
import { Feature, getUid } from 'ol';

import { MapService } from '@services';
import * as polygonStyle from '@services/map/polygon.style';

@Component({
  selector: 'app-feature-selector',
  imports: [SlicePipe, MatActionList],
  templateUrl: './feature-selector.component.html',
  styleUrl: './feature-selector.component.scss',
})
export class FeatureSelectorComponent {
  public mapService = inject(MapService);

  public features = input<Feature[]>();
  public callFeature = output<Feature>();

  public featureCache = {};

  public hoverPreview(feature: Feature) {
    this.featureCache[getUid(feature)] = feature.getStyle();
    feature.setStyle(polygonStyle.hoverPreview);
  }

  public hoverPreviewLeave(feature: Feature) {
    const id = getUid(feature);
    if (this.featureCache.hasOwnProperty(id)) {
      feature.setStyle(this.featureCache[id]);
      delete this.featureCache[id];
    }
  }
  public handleClick(feature: Feature) {
    this.hoverPreviewLeave(feature);
    this.callFeature.emit(feature);
  }
}
