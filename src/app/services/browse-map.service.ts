import { Injectable } from '@angular/core';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {getCenter} from 'ol/extent.js';
import ImageLayer from 'ol/layer/Image.js';
import Projection from 'ol/proj/Projection.js';
import Static from 'ol/source/ImageStatic.js';

interface Dimension {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class BrowseMapService {
  private map: Map;

  constructor() { }

  public setBrowse(browse: string, dim: Dimension): void {
    const extent = [0, 0, dim.width, dim.height];

    const projection = new Projection({
      code: 'scene-browse',
      units: 'pixels',
      extent
    });

    const layer = new ImageLayer({
      source: new Static({
        url: browse,
        projection: projection,
        imageExtent: extent,
      })
    });

    const view = new View({
      projection: projection,
      center: getCenter(extent),
      zoom: 1,
      minZoom: 1,
      maxZoom: 4,
    });

    if (this.map) {
      this.update(view, layer);
    } else {
      this.map = this.newMap(view, layer);
    }
  }

  private update(view: View, layer: ImageLayer): void {
    this.map.setView(view);
    const mapLayers = this.map.getLayers();
    mapLayers.setAt(0, layer);
  }

  private newMap(view: View, layer: ImageLayer): Map {
    return new Map({
      layers: [ layer ],
      target: 'browse-map',
      view
    });
  }

  cleanup(): void {
    this.map = null;
  }
}
