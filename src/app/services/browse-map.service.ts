import { Injectable } from '@angular/core';

import { Map } from 'ol';
import View from 'ol/View.js';
import ImageLayer from 'ol/layer/Image';
import * as polygonStyle from './map/polygon.style';
import Static from 'ol/source/ImageStatic.js';
import { XYZ } from 'ol/source';
import { mapOptions } from '@models';
import TileLayer from 'ol/layer/Tile';
import { Layer, Vector } from 'ol/layer';
import Polygon from 'ol/geom/Polygon';
import { Extent, getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import LayerGroup from 'ol/layer/Group';
import Projection from 'ol/proj/Projection';
import { BrowseOverlayService, WktService } from '@services';
interface Dimension {
  width: number;
  height: number;
}

export interface PinnedProduct {
  url: string;
  wkt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BrowseMapService {
  private map: Map;
  private browseLayer: ImageLayer;
  private view: View;
  private pinnedProducts: LayerGroup;

  public constructor(private wktService: WktService,
    private browseOverlayService: BrowseOverlayService) {}

  public setMapBrowse(browse: string, wkt: string = ''): void {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon: Polygon = feature.getGeometry() as Polygon;

    this.wktService.fixPolygonAntimeridian(feature, wkt);

    const polygonVectorSource = new VectorSource({
      features: [feature],
      wrapX: mapOptions.wrapX
    });
    const imagePolygonLayer = new Vector({
      source: polygonVectorSource,
      style: polygonStyle.valid,
    });

    const center = getCenter( polygon.getExtent());

    const Imagelayer = this.browseOverlayService.createImageLayer(browse, wkt);
    // const Imagelayer = new ImageLayer({
    //   source: new Static({
    //     url: browse,
    //     imageExtent: polygon.getExtent(),
    //   }),
    //   opacity: this.browseLayer?.getOpacity() ?? 1.0
    // });

    const mapSource = new XYZ({
      url : `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bFwkahiCrAA0526OlsHS`,
      wrapX: mapOptions.wrapX,
      tileSize: [512, 512]
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
      this.update(this.view, [ imagePolygonLayer, Imagelayer]);
    } else {
      this.pinnedProducts = new LayerGroup();
      this.map = this.newMap(this.view, [map_layer, imagePolygonLayer, Imagelayer]);
      this.map.addLayer(this.pinnedProducts);

      this.map.on('singleclick', e => {
        this.map.forEachLayerAtPixel(e.pixel, l => {
          this.pinnedProducts.getLayers().remove(l);
          this.pinnedProducts.getLayers().push(l);
          return true;
        });
      });
    }

    this.browseLayer = Imagelayer;
  }

  public updateBrowseOpacity(opacity: number) {
    this.browseLayer.setOpacity(opacity);
  }

  public setPinnedProducts(pinnedProductStates: {[product_id in string]: PinnedProduct}) {
    this.browseOverlayService.setPinnedProducts(pinnedProductStates, this.pinnedProducts);
  }

  public unpinAll() {
    this.pinnedProducts.getLayers().clear();
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
      view
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
      this.update(view, [layer]);
    } else {
      this.map = this.newMap(view, [layer]);
    }
  }
}
