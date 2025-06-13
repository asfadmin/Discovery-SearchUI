import { Injectable } from '@angular/core';
import { WktService } from '@services';
import { applyTransform, Extent } from 'ol/extent';
import Feature from 'ol/Feature';
import KML from 'ol/format/KML';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
// import * as olExtent from 'ol/extent';
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
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
// import { Overlay } from 'ol';
import { Icon, Style } from 'ol/style';
import { ImageStatic } from 'ol/source';
import { getTransform, Projection } from 'ol/proj';

// import { HttpClient } from '@angular/common/http';
// import { CustomProjection } from './map/views';
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
                    || datasetID === 'NISAR'
                    || datasetID === 'OPERA-S1';
            case models.SearchType.SARVIEWS_EVENTS:
                return selectedEventProducts?.length > 0;
            case models.SearchType.LIST:
                return selectedScene?.dataset === 'ALOS'
                    || selectedScene?.dataset === 'Sentinel-1A'
                    || selectedScene?.dataset === 'Sentinel-1B'
                    || selectedScene?.dataset === 'Sentinel-1 Interferogram (BETA)'
                    || selectedScene?.dataset === 'UAVSAR'
                    || selectedScene?.dataset === 'NISAR'
                    ;
            case models.SearchType.CUSTOM_PRODUCTS:
                return true;
            case models.SearchType.DISPLACEMENT:
                return true
            default:
                return false;

        }
    }),
  );

  constructor(
    private wktService: WktService,
    private store$: Store<AppState>,
    // private http: HttpClient,
) { }

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

  public getPolygonFromFeature(feature: Feature<Geometry>, wkt: string): Polygon {
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

  public getKMLLayer(product: models.CMRProduct, png_url: string, wkt: string, className: string = 'ol-layer', _layer_id: string = '') {
    function _substitute_url(url: string) {
        console.log(url)
        // https://openlayers.org/en/v7.5.2/apidoc/module-ol_format_KML-KML.html
        // For `iconUrlFunction`, kmls are formatted without url of image
        return png_url
        // return null

    }


    const feature = this.wktService.wktToFeature(wkt, 'EPSG:4326');
    const feature2 = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    
    const polygon = this.getPolygonFromFeature(feature, wkt);
    const polygon2 = this.getPolygonFromFeature(feature2, wkt);

//     let proj = new CustomProjection(
//     'EPSG:27700',
//   '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
//     '+x_0=400000 +y_0=-100000 +ellps=airy ' +
//     '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
//     '+units=m +no_defs',
//         polygon.getExtent()
//     )
    // return Imagelayer;
    let proj = new Projection({code: 'EPSG:4326', 'metersPerUnit': 5, "axisOrientation": 'nwu', })
    
    // let l = polygon.getArea()
    // left
    // bottom
    // right
    // top

    let fromLonLat = getTransform(proj, 'EPSG:3857');
    let extent = polygon.getExtent()
    // olExtent.getlef
    // let flatcoords = polygon.getCoordinates()[0]

    console.log(extent)
    console.log(polygon.getCoordinates())
    // let simped = polygon.getSimplifiedGeometry(0.01).getCoordinates()[0]
    // simped.pop()
    // extent[2] = extent[2] - 5/2  

    let img = new ImageLayer({
        // source: static_image_source,
        extent: polygon2.getExtent(),
        
    })
    
    let coords = polygon.getCoordinates()[0]
    let ext = applyTransform([...coords[1], ...coords[3]], fromLonLat, undefined    )
    let static_image_source = new ImageStatic({
        url: png_url,
        projection: 'EPSG: 4326',
        // imageExtent: img.getExtent(),
        imageExtent: ext
        // imageExtent: extent.map(f => f),
        // imageExtent: olExtent.boundingExtent(
        //     polygon.getCoordinates()[0].reverse()
        // ),
        // imageSize: [2018, 1845]
    })
    

    
    img.setSource(static_image_source)
    return img;
    const iconStyle = new Style({
    image: new Icon({
        // anchor: [0.5, 46],
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',
        src: png_url,
        scale: 200
    }),

    });

    feature.setStyle(iconStyle)
    let source = new VectorSource({
        wrapX: models.mapOptions.wrapX,
        features: [feature]
        });
    const vecLayer = new VectorLayer({
        "extent": polygon.getExtent(),
        source,
        "zIndex": 0,
        opacity: 1.0,
        className,
        // style: iconStyle
    })
    // vecLayer.setStyle(iconStyle)
    return vecLayer
    // function loader_function(extent, resolution, projection, success, failure) {
    //     const proj = projection.getCode();
        
    //     const url = 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
    //     'version=1.1.0&request=GetFeature&typename=osm:water_areas&' +
    //     'outputFormat=application/json&srsname=' + proj + '&' +
    //     'bbox=' + extent.join(',') + ',' + proj;
        
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('GET', url);
    //     const onError = function() {
    //     vectorSource.removeLoadedExtent(extent);
    //     failure();
    //     }
    //     xhr.onerror = onError;
    //     xhr.onload = function() {
    //     if (xhr.status == 200) {
    //     const features = vectorSource.getFormat().readFeatures(xhr.responseText);
    //     vectorSource.addFeatures(features);
    //     success(features);
    //     } else {
    //     onError();
    //     }
    //     }
    //     xhr.send();
    // }
    let kml = product.metadata.nisar.additionalUrls.find(https_url => https_url.endsWith('.kml'))

    let vector = new VectorLayer({
      source: new VectorSource({
        url: kml,
        // loader: loader_function,
        format: new KML({iconUrlFunction: _substitute_url}),
      }),
    });
    return vector;
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
