import { Injectable, inject } from '@angular/core';

import { Map } from 'ol';
import View from 'ol/View.js';
import ImageLayer from 'ol/layer/Image';
import * as polygonStyle from './map/polygon.style';
import Static from 'ol/source/ImageStatic.js';
import { XYZ } from 'ol/source';
import { mapOptions } from '@models';
import TileLayer from 'ol/layer/WebGLTile.js';
import { Layer, Vector } from 'ol/layer';
import Polygon from 'ol/geom/Polygon';
import { Extent, getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import Projection from 'ol/proj/Projection';
import { BrowseOverlayService, WktService } from '@services';
interface Dimension {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class BrowseMapService {
  private wktService = inject(WktService);
  private browseOverlayService = inject(BrowseOverlayService);

  private map: Map;
  private browseLayer: Layer;
  private view: View;

  public setMapBrowse(browse: string, wkt = ''): void {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon: Polygon = feature.getGeometry() as Polygon;

    this.wktService.fixPolygonAntimeridian(feature, wkt);

    const polygonVectorSource = new VectorSource({
      features: [feature],
      wrapX: mapOptions.wrapX,
    });
    const imagePolygonLayer = new Vector({
      source: polygonVectorSource,
      style: polygonStyle.valid,
    });

    const center = getCenter(polygon.getExtent());

    const Imagelayer = this.browseOverlayService.createNormalImageLayer(
      browse,
      wkt,
    );

    const mapSource = new XYZ({
      url: `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bFwkahiCrAA0526OlsHS`,
      wrapX: mapOptions.wrapX,
      tileSize: [512, 512],
    });

    const map_layer = new TileLayer({ source: mapSource });

    if (!this.map) {
      this.view = new View({
        projection: 'EPSG:3857',
        center,
        zoom: 4,
        minZoom: 1,
        maxZoom: 14,
      });
    }

    if (this.map) {
      this.update(this.view, [imagePolygonLayer, Imagelayer]);
    } else {
      this.map = this.newMap(this.view, [
        map_layer,
        imagePolygonLayer,
        Imagelayer,
      ]);
    }

    this.browseLayer = Imagelayer;
  }

  public updateBrowseOpacity(opacity: number) {
    this.browseLayer.setOpacity(opacity);
  }

  private update(view: View, layers: Layer[]): void {
    this.map.setView(view);
    const mapLayers = this.map.getLayers();
    if (layers.length > 1) {
      const baseLayers = layers.slice(0, 3);
      baseLayers.forEach((l, idx) => mapLayers.setAt(idx + 1, l));
    } else {
      mapLayers.setAt(0, layers[0]);
    }
  }

  private newMap(view: View, layers: Layer[]): Map {
    return new Map({
      layers: layers,
      target: 'browse-map',
      view,
    });
  }

  cleanup(): void {
    this.map = null;
  }

  public setBrowse(browse: string, dim: Dimension): void {
    const extent = [0, 0, dim.width, dim.height] as Extent;

    const projection = new Projection({
      code: 'scene-browse',
      units: 'pixels',
      extent,
    });

    const layer = new ImageLayer({
      source: new Static({
        url: browse,
        projection: projection,
        imageExtent: extent,
      }),
    });

    if (!this.map) {
      this.view = new View({
        projection: projection,
        center: getCenter(extent),
        zoom: 1,
        minZoom: 1,
        maxZoom: 4,
      });
    }

    if (this.map) {
      this.update(this.view, [layer]);
    } else {
      this.map = this.newMap(this.view, [layer]);
    }
  }
}
