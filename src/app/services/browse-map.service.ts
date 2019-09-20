import { Injectable } from '@angular/core';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {getCenter} from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';

@Injectable({
  providedIn: 'root'
})
export class BrowseMapService {
  private map: Map;
  private layer: ImageLayer;

  private extent = [0, 0, 1024, 1024];

  constructor() { }

  public setBrowse(browse: string): void {
    if (this.map) {
      this.update(browse);
    } else {
      this.newMap(browse);
    }
  }

  private update(browse: string): void {
    const projection = new Projection({
      code: 'scene-browse',
      units: 'pixels',
      extent: this.extent
    });

    this.layer = new ImageLayer({
      source: new Static({
        url: browse,
        projection: projection,
        imageExtent: this.extent,
      })
    });

    const view = new View({
      projection: projection,
      center: getCenter(this.extent),
      zoom: 1,
      minZoom: 1,
      maxZoom: 4,
    });

    this.map.setView(view);
    const mapLayers = this.map.getLayers();
    mapLayers.setAt(0, this.layer);
  }

  private newMap(browse: string): void {
    const projection = new Projection({
      code: 'scene-browse',
      units: 'pixels',
      extent: this.extent
    });

    const view = new View({
      projection: projection,
      center: getCenter(this.extent),
      zoom: 1,
      minZoom: 1,
      maxZoom: 4,
    });


    this.layer = new ImageLayer({
      source: new Static({
        url: browse,
        projection: projection,
        imageExtent: this.extent
      })
    });

    this.map = new Map({
      layers: [ this.layer ],
      target: 'browse-map',
      view
    });
  }

  cleanup(): void {
    this.map = null;
  }
}
