import { Injectable } from '@angular/core';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
// import { Extent } from 'ol/extent.js';
// import ImageLayer from 'ol/layer/Image.js';
import ImageLayer from 'ol/layer/Image';
import * as polygonStyle from './map/polygon.style';
// import { Projection as VProjection } from '@services/map/views/map-view';
// import Projection from 'ol/proj/Projection.js';

// import * as proj from 'ol/proj';
import Static from 'ol/source/ImageStatic.js';
import { XYZ } from 'ol/source';
import { mapOptions } from '@models';
import TileLayer from 'ol/layer/Tile';
import { Layer, Vector } from 'ol/layer';
// import { WktService } from '@services';
import Polygon from 'ol/geom/Polygon';
import { getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import WKT from 'ol/format/WKT';
import LayerGroup from 'ol/layer/Group';
import { Collection } from 'ol';
// import { Feature } from 'ol';
// import { transformExtent } from 'ol/proj';

interface Dimension {
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class BrowseMapService {
  private map: Map;
  private browseLayer: ImageLayer;
  private view: View;
  private pinnedProducts: LayerGroup;

  public setBrowse(browse: string, dim: Dimension, wkt: string = ''): void {
    const format = new WKT();
    const feature = format.readFeature(wkt, {dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:3857'});
    const polygon: Polygon = feature.getGeometry() as Polygon;

    const polygonVectorSource = new VectorSource({
      features: [feature],
      wrapX: mapOptions.wrapX
    })
    const imagePolygonLayer = new Vector({
      source: polygonVectorSource,
      style: polygonStyle.valid,
    })

    console.log(dim);

    const coord = getCenter( polygon.getExtent());

    const Imagelayer = new ImageLayer({
      source: new Static({
        url: browse,
        imageExtent: polygon.getExtent(),
      }),
      opacity: this.browseLayer?.getOpacity() ?? 1.0
    });

    const mapSource = new XYZ({
      url : `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bFwkahiCrAA0526OlsHS`,
      wrapX: mapOptions.wrapX,
      tileSize: [512, 512]
    });

    const map_layer = new TileLayer({ source: mapSource });

    if(!this.map) {
    this.view = new View({
      projection: 'EPSG:3857',
      center: coord,
      zoom: 4,
      minZoom: 1,
      maxZoom: 14,
    });

    }

    if (this.map) {
      this.update(this.view, [ imagePolygonLayer, Imagelayer]);
    } else {
      this.pinnedProducts = new LayerGroup();
      this.map = this.newMap(this.view, [map_layer, imagePolygonLayer, Imagelayer]);
      this.map.addLayer(this.pinnedProducts);
    }

    this.browseLayer = Imagelayer;
  }

  public updateBrowseOpacity(opacity: number) {
    this.browseLayer.setOpacity(opacity);
  }

  public togglePinnedProduct() {
    const pinnedLayers = this.pinnedProducts;
    const removed = (pinnedLayers.getLayers() as Collection<ImageLayer>).getArray().find(l => (l.getSource() as Static).getUrl() === (this.browseLayer.getSource() as Static).getUrl());
    if(!removed) {
      pinnedLayers.getLayers().push(this.browseLayer);
      // this.pinnedProducts.setLayers()
    } else {
      this.pinnedProducts.getLayers().remove(removed);
    }

    // this.map.removeLayer(pinnedLayers);
    // this.map.addLayer(pinnedLayers);
  }

  private update(view: View, layer: Layer[]): void {
    this.map.setView(view);
    const mapLayers = this.map.getLayers();
    const baseLayers = layer.slice(0, 3);
    baseLayers.forEach((layer, idx) => mapLayers.setAt(idx + 1, layer));
    // this.map.removeLayer(this.pinnedProducts);
  }

  private newMap(view: View, layer: Layer[]): Map {
    return new Map({
      layers: layer ,
      target: 'browse-map',
      view
    });
  }

  cleanup(): void {
    this.map = null;
  }
}
