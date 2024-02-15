import { Injectable } from '@angular/core';
import { WktService } from '@services';
import { Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

import { Coordinate } from 'ol/coordinate';
import MultiPolygon from 'ol/geom/MultiPolygon';
import { PinnedProduct } from './browse-map.service';
import LayerGroup from 'ol/layer/Group';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as models from '@models';
import * as searchStore from '@store/search';
import * as sceneStore from '@store/scenes';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import GeoTIFFSource from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile.js';
import ImageSource from 'ol/source/Image';

@Injectable({
  providedIn: 'root'
})
export class BrowseOverlayService {

  public isBrowseOverlayEnabled$: Observable<boolean> = combineLatest([
    this.store$.select(searchStore.getSearchType),
    this.store$.select(sceneStore.getSelectedScene),
    this.store$.select(filtersStore.getSelectedDatasetId),
      this.store$.select(sceneStore.getSelectedSarviewsEventProducts)]
    ).pipe(
      map(([searchtype, selectedScene, datasetID, selectedEventProducts]) => {
        switch (searchtype) {
          case models.SearchType.DATASET:
            return datasetID === 'AVNIR'
            || datasetID === 'ALOS'
            || datasetID === 'SENTINEL-1'
            || datasetID === 'SENTINEL-1 INTERFEROGRAM (BETA)'
            || datasetID === 'UAVSAR'
            || datasetID === 'OPERA-S1';
          case models.SearchType.SARVIEWS_EVENTS:
            return selectedEventProducts?.length > 0;
          case models.SearchType.LIST:
            return selectedScene?.dataset === 'ALOS'
            || selectedScene?.dataset === 'Sentinel-1A'
            || selectedScene?.dataset === 'Sentinel-1B'
            || selectedScene?.dataset === 'Sentinel-1 Interferogram (BETA)'
            || selectedScene?.dataset === 'UAVSAR';
          case models.SearchType.CUSTOM_PRODUCTS:
            return true;
          default:
            return false;

        }
    }),
  );

  constructor(private wktService: WktService,
    private store$: Store<AppState>) { }

  private createImageSource(url: string, extent: Extent) {
    return new Static({
         url,
         imageExtent: extent,
       });
  }

  private createGeotiffSource(blob: Blob) {
    return new GeoTIFFSource({
      sources: [{
         blob,
         min: 0.0000,
         max: 0.15,
         bands: [1],
         nodata: 0
      }], 
       });
  }

  public createNormalImageLayer(url: string, wkt: string, className: string = 'ol-layer', layer_id: string = '') {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon = this.getPolygonFromFeature(feature, wkt);

    const source = this.createImageSource(url, polygon.getExtent());

    const output = new ImageLayer({
      source: source as ImageSource,
      className,
      zIndex: 0,
      extent: polygon.getExtent(),
      opacity: 1.0,
    });

    if (layer_id !== '') {
      output.set('layer_id', layer_id);
    }

    return output;
  }

  public createGeotiffLayer(blob: Blob, _wkt: string, className: string = 'ol-layer', layer_id: string = '') {

    const source = this.createGeotiffSource(blob);


    const output =  new TileLayer(
      {
        source: source as GeoTIFFSource,
        style: {
          color: [
            'interpolate',
            ['linear'],
            ['band', 1],
            0.0,
            [0, 0, 0, 0],
            0.00001,
            [0, 0, 0, 1],
            1.0,
            [255, 255, 255, 1],
          ],
        },
        className,
        zIndex: 0,
        opacity: 1.0,
      }
    )


    if (layer_id !== '') {
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

    const Imagelayer = new ImageLayer({
      source: new Static({
        url,
        imageExtent: polygon.getExtent(),
      }),
      zIndex: 0,
      extent: polygon.getExtent(),
      opacity: 1.0,
      className});

    if (layer_id !== '') {
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

  public setPinnedProducts(pinnedProducts: {[product_id in string]: PinnedProduct}, productLayerGroup: LayerGroup) {

    const pinnedProductIds = Object.keys(pinnedProducts);
    const currentPinnedProductsIds: string[] = productLayerGroup.getLayersArray().map(layer => layer.get('layer_id'));
    const toAdd = pinnedProductIds.filter(id => !currentPinnedProductsIds.includes(id));
    const toRemove = currentPinnedProductsIds.filter(id => !pinnedProductIds.includes(id));
    if (pinnedProductIds.length === 0) {
    productLayerGroup.getLayers().clear();
    } else {
      this.unpinProducts(toRemove, productLayerGroup);
      this.pinProducts(toAdd, pinnedProducts, productLayerGroup);
    }
  }

  private pinProducts(layersToAdd: string[], pinnedProductStates: {[product_id in string]: PinnedProduct}, productLayerGroup: LayerGroup) {
    const newLayers = layersToAdd.map(layer_id => this.createNormalImageLayer(
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
      if (!!found) {
      productLayerGroup.getLayers().remove(found);
      }
    });
  }
}
