import { Injectable } from '@angular/core';

import { Vector as VectorSource, Layer } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Draw } from 'ol/interaction.js';

import * as polygonStyle from './polygon.style';

@Injectable({
  providedIn: 'root'
})
export class DrawService {
  private interaction: Draw;
  private style = polygonStyle.valid;

  private source = new VectorSource({
    noWrap: true, wrapX: false
  });

  private layer = new VectorLayer({
    source: this.source,
    style: polygonStyle.invalid
  });

  public getSource(): VectorSource {
    return this.source;
  }

  public getLayer(): VectorLayer {
    return this.layer;
  }

  public getInteraction(): Draw {
    return this.interaction;
  }

  public setInteraction(interaction: Draw): void {
    this.interaction = interaction;
  }

  public setGoodStyle(): void {
    if (this.style === polygonStyle.omitted) {
      return;
    }

    this.layer.setStyle(this.style);
  }

  public setValidStyle(): void {
    this.style = polygonStyle.valid;
    this.layer.setStyle(this.style);
  }

  public setOmittedStyle() {
    this.style = polygonStyle.omitted;
    this.layer.setStyle(this.style);
  }

  public setFeature(feature): void {
    this.source.clear();
    this.source.addFeature(feature);
    this.layer.setStyle(this.style);
  }

  public clear(): void {
    this.source.clear();
    this.layer.setStyle(this.style);
  }


  constructor() { }
}
