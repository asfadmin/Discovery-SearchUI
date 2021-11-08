import { Injectable } from '@angular/core';
import { WktService } from '@services';
import { Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import Raster
, { RasterOperationType }
from 'ol/source/Raster';

import { Coordinate } from 'ol/coordinate';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { PinnedProduct } from './browse-map.service';
import LayerGroup from 'ol/layer/Group';
import { SearchType } from '@models';

@Injectable({
  providedIn: 'root'
})
export class BrowseOverlayService {

  constructor(private wktService: WktService) { }

  private createImageSource(url: string, extent: Extent) {
    return new Static({
         url,
         imageExtent: extent,
       });
  }

  public createNormalImageLayer(url: string, wkt: string, className: string = 'ol-layer', layer_id: string = '') {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon = this.getPolygonFromFeature(feature, wkt);
    const source = this.createImageSource(url, polygon.getExtent());

    const output = new ImageLayer({
      source,
      className,
      zIndex: 0,
      extent: polygon.getExtent(),
      opacity: 1.0,
    });

    if(layer_id !== '') {
      output.set('layer_id', layer_id);
    }

    return output;
  }

  private getPolygonFromFeature(feature: Feature<Geometry>, wkt: string): Polygon {
    const polygon: Polygon = feature.getGeometry() as Polygon;
    this.fixPolygonAntimeridian(feature, wkt);

    return polygon;
  }

  public createImageLayer(url: string, wkt: string, className: string = 'ol-layer', layer_id: string = '') {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon = this.getPolygonFromFeature(feature, wkt);

    const rLayer = new Raster({
      sources: [new Static({
        url,
        imageExtent: polygon.getExtent(),
        // crossOrigin: '*'
        crossOrigin: ''
      })],
      operationType: 'pixel' as RasterOperationType,
      operation: (p0: number[][], _) => {
              var pixel = p0[0];

            var r = pixel[0];
            var g = pixel[1];
            var b = pixel[2];

            if(r + g + b <= 10) {
              return [0, 0, 0, 0];
            }
            // // CIE luminance for the RGB
            // var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;

            // pixel[0] = v; // Red
            // pixel[1] = v; // Green
            // pixel[2] = v; // Blue
            // //pixel[3] = 255;

            return pixel;
          }
      // opacity: this.browseLayer?.getOpacity() ?? 1.0
    });

    const Imagelayer = new ImageLayer({
      source: rLayer,
      zIndex: 0,
      extent: polygon.getExtent(),
      opacity: 1.0,
      className});

    if(layer_id !== '') {
      Imagelayer.set('layer_id', layer_id);
    }

    return Imagelayer;
  }

  private fixPolygonAntimeridian(feature: Feature<Geometry>, wkt: string) {
    const isMultiPolygon = wkt.includes('MULTIPOLYGON');
    let polygonCoordinates: Coordinate[];
    const geom = feature.getGeometry();
    if (isMultiPolygon) {
      polygonCoordinates = (geom as MultiPolygon).getPolygon(0).getCoordinates()[0];
      (geom as MultiPolygon).setCoordinates([[this.wktService.fixAntimeridianCoordinates(polygonCoordinates)]]);
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
      (geom as Polygon).setCoordinates([this.wktService.fixAntimeridianCoordinates(polygonCoordinates)]);
    }
  }

  public setPinnedProducts(pinnedProducts: {[product_id in string]: PinnedProduct}, productLayerGroup: LayerGroup, searchType: SearchType) {
    // Built in method Collection.clear() causes flickering when pinning new product,
    // have to keep track of pinned products as work around

    const pinnedProductIds = Object.keys(pinnedProducts);
    // const pinned_ids = pinnedProductIds.filter(id => pinnedProductStates[id].isPinned);
    const currentPinnedProductsIds: string[] = productLayerGroup.getLayersArray().map(layer => layer.get("layer_id"));
    const toAdd = pinnedProductIds.filter(id => !currentPinnedProductsIds.includes(id));
    const toRemove = currentPinnedProductsIds.filter(id => !pinnedProductIds.includes(id));
    if (pinnedProductIds.length === 0) {
    productLayerGroup.getLayers().clear();
    } else {
      this.unpinProducts(toRemove, productLayerGroup);
      this.pinProducts(toAdd, pinnedProducts, productLayerGroup, searchType)
    }
  }

  private pinProducts(layersToAdd: string[], pinnedProductStates: {[product_id in string]: PinnedProduct}, productLayerGroup: LayerGroup, searchType: SearchType) {
    let requireCors = false;
    if(searchType !== SearchType.SARVIEWS_EVENTS) {
      requireCors = true;
    }
    const newLayers = layersToAdd.map(layer_id => requireCors ? this.createImageLayer(
      pinnedProductStates[layer_id].url,
      pinnedProductStates[layer_id].wkt,
      'ol-layer',
      layer_id,
    ) : this.createNormalImageLayer(
      pinnedProductStates[layer_id].url,
      pinnedProductStates[layer_id].wkt,
      'ol-layer',
      layer_id,
    )
    );
    productLayerGroup.getLayers().extend(newLayers);
  }

  private unpinProducts(layersToRemove: string[], productLayerGroup: LayerGroup) {
    layersToRemove.forEach(product_id => {
      const found = productLayerGroup.getLayersArray().find(layer => layer.get('layer_id') === product_id);
      if(!!found) {
      productLayerGroup.getLayers().remove(found);
      }
    });
  }
}
