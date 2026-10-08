import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Fill, Stroke, Style } from 'ol/style';
import { map, Subscription } from 'rxjs';

import { Dataset } from '@models';

@Injectable({
  providedIn: 'root',
})
export class PairSelectionService {
  private source: VectorSource;
  public layer: VectorLayer<VectorSource>;
  private http = inject(HttpClient);

  private request: Subscription;
  constructor() {
    this.source = new VectorSource();

    this.layer = new VectorLayer<VectorSource>({
      source: this.source,
      style: new Style({
        fill: new Fill({
          color: '#FFFFFF33',
        }),
        stroke: new Stroke({
          color: 'black',
        }),
      }),
    });
  }

  public loadFramePreview(dataset: Dataset, _params: URLSearchParams = null) {
    const url = dataset?.frameMap.ascending; // TODO: define these better, and include params with
    if (this.request) {
      this.request.unsubscribe();
    }
    this.request = this.http
      .get(url)
      .pipe(
        map((test) => {
          const features = new GeoJSON().readFeatures(test, {
            featureProjection: 'EPSG:3857', // TODO: Adjust to views later
          });
          return features;
        }),
      )
      .subscribe((features) => {
        this.source.clear();
        this.source.addFeatures(features);
      });
  }
  public clearFramePreview() {
    this.source.clear();
  }
}
