import { Injectable, inject } from '@angular/core';
import { WktService } from '@services';
import { Extent, getCenter } from 'ol/extent';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import Polygon from 'ol/geom/Polygon';
import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
// import * as olExtent from 'ol/extent';
import { Coordinate, rotate } from 'ol/coordinate';
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
import { Icon, Stroke, Style } from 'ol/style';
import { Point } from 'ol/geom';
import {
  Projection,
  addCoordinateTransforms,
  addProjection,
  get as getProjection,
  transform,
} from 'ol/proj';
import { L1L2BrowseCollectionMapping } from '@models/datasets/nisar';

// import { HttpClient } from '@angular/common/http';
// import { CustomProjection } from './map/views';
@Injectable({
  providedIn: 'root',
})
export class BrowseOverlayService {
  private wktService = inject(WktService);
  private store$ = inject<Store<AppState>>(Store);

  public isBrowseOverlayEnabled$: Observable<boolean> = combineLatest([
    this.store$.select(searchStore.getSearchType),
    this.store$.select(sceneStore.getSelectedScene),
    this.store$.select(filtersStore.getSelectedDatasetId),
    this.store$.select(sceneStore.getSelectedSarviewsEventProducts),
  ]).pipe(
    map(([searchtype, selectedScene, datasetID, selectedEventProducts]) => {
      switch (searchtype) {
        case models.SearchType.DATASET:
          return (
            datasetID === 'AVNIR' ||
            datasetID === 'ALOS' ||
            datasetID === 'SENTINEL-1' ||
            datasetID === 'SENTINEL-1 INTERFEROGRAM (BETA)' ||
            datasetID === 'UAVSAR' ||
            datasetID === 'OPERA-S1' ||
            datasetID === 'TROPO'
          );
        case models.SearchType.SARVIEWS_EVENTS:
          return selectedEventProducts?.length > 0;
        case models.SearchType.LIST:
          return (
            selectedScene?.dataset === 'ALOS' ||
            selectedScene?.dataset === 'Sentinel-1A' ||
            selectedScene?.dataset === 'Sentinel-1B' ||
            selectedScene?.dataset === 'Sentinel-1C' ||
            selectedScene?.dataset === 'Sentinel-1 Interferogram (BETA)' ||
            selectedScene?.dataset === 'UAVSAR'
          );
        case models.SearchType.CUSTOM_PRODUCTS:
          return true;
        case models.SearchType.DISPLACEMENT:
          return true;
        default:
          return false;
      }
    }),
  );

  private createImageSource(url: string, extent: Extent) {
    return new Static({
      url,
      imageExtent: extent,
    });
  }

  private createGeotiffSource(blob: Blob) {
    return new GeoTIFFSource({
      sources: [
        {
          blob,
          min: 0.0,
          max: 0.15,
          bands: [1],
          nodata: 0,
        },
      ],
    });
  }

  public createNormalImageLayer(
    url: string,
    wkt: string,
    className = 'ol-layer',
    layer_id = '',
  ) {
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');
    const polygon = this.getPolygonFromFeature(feature, wkt);

    const isNisarL1Browse = url.split('/').pop().startsWith('NISAR_L1');
    if (isNisarL1Browse) {
      url = this.nisarL1ToL2BrowseImage(url);
    }

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

  public nisarL1ToL2BrowseImage(url: string) {
    if (url === '/assets/no-browse.png') {
      return url;
    }

    const fileName = url.split('/').pop();
    const metadata = fileName.split('_');
    const productType = metadata[3];
    const productionConfiguration = metadata[1];
    const shortName = `NISAR_${productionConfiguration}_${productType}`;

    const outputUrl = url
      .replaceAll(
        shortName,
        L1L2BrowseCollectionMapping[productType].collection,
      )
      .replaceAll(
        productType,
        L1L2BrowseCollectionMapping[productType].productType,
      )
      .replaceAll('L1', 'L2');
    return outputUrl;
  }

  public createGeotiffLayer(
    blob: Blob,
    _wkt: string,
    className = 'ol-layer',
    layer_id = '',
  ) {
    const source = this.createGeotiffSource(blob);

    const output = new TileLayer({
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
    });

    if (layer_id !== '') {
      output.set('layer_id', layer_id);
    }

    return output;
  }

  public getPolygonFromFeature(
    feature: Feature<Geometry>,
    wkt: string,
  ): Polygon {
    const polygon: Polygon = feature.getGeometry() as Polygon;
    this.fixPolygonAntimeridian(feature, wkt);

    return polygon;
  }

  public createImageLayer(
    url: string,
    wkt: string,
    className = 'ol-layer',
    layer_id = '',
  ) {
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
      className,
    });

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
      polygonCoordinates = (geom as MultiPolygon)
        .getPolygon(0)
        .getCoordinates()[0];
      (geom as MultiPolygon).setCoordinates([
        [this.wktService.fixAntimeridianCoordinates(polygonCoordinates)],
      ]);
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
      (geom as Polygon).setCoordinates([
        this.wktService.fixAntimeridianCoordinates(polygonCoordinates),
      ]);
    }
  }

  public getKMLLayer(
    _product: models.CMRProduct,
    _png_url: string,
    wkt: string,
    className = 'ol-layer',
    _layer_id = '',
  ) {
    // function _substitute_url(url: string) {
    //     console.log(url)
    //     // https://openlayers.org/en/v7.5.2/apidoc/module-ol_format_KML-KML.html
    //     // For `iconUrlFunction`, kmls are formatted without url of image
    //     return png_url
    //     // return null

    // }

    // const feature = this.wktService.wktToFeature(wkt, 'EPSG:4326');
    const feature = this.wktService.wktToFeature(wkt, 'EPSG:3857');

    // const polygon = this.getPolygonFromFeature(feature, wkt);
    // const polygon2 = this.getPolygonFromFeature(feature2, wkt);
    // let anchor = this.getPolygonFromFeature(feature, wkt).getCoordinates()[0][0]
    const iconStyle = new Style({
      image: new Icon({
        anchorXUnits: 'pixels',
        anchorYUnits: 'pixels',

        // src: 'https://avatars.githubusercontent.com/u/1342004?s=48&v=4',
        src: _png_url,
        scale: 0.05,
        // 'anchorOrigin': 'bottom-left',
      }),
    });

    const lineStyle = new Style({
      stroke: new Stroke({
        color: '#00FF00',
        width: 10,
      }),
    });
    feature.setStyle((_feature) => {
      const stringCoords = this.getPolygonFromFeature(
        feature,
        wkt,
      ).getCoordinates()[0];
      let coords = stringCoords.slice(-2);
      if (
        coords[1][0] == coords[0][0] &&
        coords[1][1] == coords[0][1] &&
        stringCoords.length > 2
      ) {
        // useful for drawing
        coords = stringCoords.slice(-3, -1);
      }
      // iconStyle.getImage().set
      iconStyle.setGeometry(new Point(stringCoords[1]));
      // iconStyle.getImage().setDisplacement(coords[0])
      iconStyle
        .getImage()
        .setRotation(
          Math.atan2(coords[1][0] - coords[0][0], coords[1][1] - coords[0][1]),
        );

      return [lineStyle, iconStyle];
    });
    const source = new VectorSource({
      wrapX: models.mapOptions.wrapX,
      features: [feature],
    });
    const vecLayer = new VectorLayer({
      // "extent": polygon.getExtent(),
      source,
      zIndex: 0,
      opacity: 1.0,
      className,
      // style: iconStyle
    });
    return vecLayer;
    //     let proj = new CustomProjection(
    //     'EPSG:27700',
    //   '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    //     '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    //     '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    //     '+units=m +no_defs',
    //         polygon.getExtent()
    //     )
    // return Imagelayer;
    // let proj = new Projection({code: 'EPSG:4326', 'metersPerUnit': 5, "axisOrientation": 'nwu', })

    // // let l = polygon.getArea()
    // // left
    // // bottom
    // // right
    // // top

    // let fromLonLat = getTransform(proj, 'EPSG:3857');
    // let extent = polygon.getExtent()
    // // olExtent.getlef
    // // let flatcoords = polygon.getCoordinates()[0]

    // console.log(extent)
    // console.log(polygon.getCoordinates())
    // // let simped = polygon.getSimplifiedGeometry(0.01).getCoordinates()[0]
    // // simped.pop()
    // // extent[2] = extent[2] - 5/2

    const polygon = this.getPolygonFromFeature(feature, wkt);
    const img = new ImageLayer({
      // source: static_image_source,
      extent: polygon.getExtent(),
    });
    const rotateProjection = (projection, angle, extent) => {
      function rotateCoordinate(coordinate, angle, anchor) {
        const coord = rotate(
          [coordinate[0] - anchor[0], coordinate[1] - anchor[1]],
          angle,
        );
        return [coord[0] + anchor[0], coord[1] + anchor[1]];
      }

      function rotateTransform(coordinate) {
        return rotateCoordinate(coordinate, angle, getCenter(extent));
      }

      function normalTransform(coordinate) {
        return rotateCoordinate(coordinate, -angle, getCenter(extent));
      }

      const normalProjection = getProjection(projection);

      const rotatedProjection = new Projection({
        code:
          normalProjection.getCode() +
          ':' +
          angle.toString() +
          ':' +
          extent.toString(),
        units: normalProjection.getUnits(),
        extent: extent,
      });
      addProjection(rotatedProjection);

      addCoordinateTransforms(
        'EPSG:4326',
        rotatedProjection,
        function (coordinate) {
          return rotateTransform(
            transform(coordinate, 'EPSG:4326', projection),
          );
        },
        function (coordinate) {
          return transform(
            normalTransform(coordinate),
            projection,
            'EPSG:4326',
          );
        },
      );

      addCoordinateTransforms(
        'EPSG:3857',
        rotatedProjection,
        function (coordinate) {
          return rotateTransform(
            transform(coordinate, 'EPSG:3857', projection),
          );
        },
        function (coordinate) {
          return transform(
            normalTransform(coordinate),
            projection,
            'EPSG:3857',
          );
        },
      );

      // also set up transforms with any projections defined using proj4
      // if (typeof proj4 !== "undefined") {
      //     var projCodes = Object.keys(proj4.defs);
      //     projCodes.forEach(function(code) {
      //     var proj4Projection = getProjection(code);
      //     if (!getTransform(proj4Projection, rotatedProjection)) {
      //         addCoordinateTransforms(
      //         proj4Projection,
      //         rotatedProjection,
      //         function(coordinate) {
      //             return rotateTransform(
      //             transform(coordinate, proj4Projection, projection)
      //             );
      //         },
      //         function(coordinate) {
      //             return transform(
      //             normalTransform(coordinate),
      //             projection,
      //             proj4Projection
      //             );
      //         }
      //         );
      //     }
      //     });
      // }

      return rotatedProjection;
    };
    // let coords = polygon.getCoordinates()[0]
    // let ext = applyTransform([...coords[1], ...coords[3]], fromLonLat, undefined    )
    const static_image_source = new Static({
      url: _png_url,
      projection: rotateProjection('EPSG:27700', Math.PI / 4, img.getExtent()),
      // imageExtent: img.getExtent(),
      // imageExtent: ext,
      // imageExtent: extent.map(f => f),
      // imageExtent: olExtent.boundingExtent(
      //     polygon.getCoordinates()[0].reverse()
      // ),
      // imageSize: [2018, 1845]
    });
    img.setSource(static_image_source);
    return img;
    // img.getSource().getImage()
    // static_image_source.getImage()
  }

  public setPinnedProducts(
    pinnedProducts: Record<string, PinnedProduct>,
    productLayerGroup: LayerGroup,
  ) {
    const pinnedProductIds = Object.keys(pinnedProducts);
    const currentPinnedProductsIds: string[] = productLayerGroup
      .getLayersArray()
      .map((layer) => layer.get('layer_id'));
    const toAdd = pinnedProductIds.filter(
      (id) => !currentPinnedProductsIds.includes(id),
    );
    const toRemove = currentPinnedProductsIds.filter(
      (id) => !pinnedProductIds.includes(id),
    );
    if (pinnedProductIds.length === 0) {
      productLayerGroup.getLayers().clear();
    } else {
      this.unpinProducts(toRemove, productLayerGroup);
      this.pinProducts(toAdd, pinnedProducts, productLayerGroup);
    }
  }

  private pinProducts(
    layersToAdd: string[],
    pinnedProductStates: Record<string, PinnedProduct>,
    productLayerGroup: LayerGroup,
  ) {
    const newLayers = layersToAdd.map((layer_id) =>
      this.createNormalImageLayer(
        pinnedProductStates[layer_id].url,
        pinnedProductStates[layer_id].wkt,
        'ol-layer',
        layer_id,
      ),
    );
    productLayerGroup.getLayers().extend(newLayers);
  }

  private unpinProducts(
    layersToRemove: string[],
    productLayerGroup: LayerGroup,
  ) {
    layersToRemove.forEach((product_id) => {
      const found = productLayerGroup
        .getLayersArray()
        .find((layer) => layer.get('layer_id') === product_id);
      if (found) {
        productLayerGroup.getLayers().remove(found);
      }
    });
  }
}
