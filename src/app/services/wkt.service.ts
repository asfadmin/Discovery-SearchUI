import { Injectable } from '@angular/core';
import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature';

import WKT from 'ol/format/WKT.js';
import Geometry from 'ol/geom/Geometry';
import MultiPolygon from 'ol/geom/MultiPolygon';
import {Polygon } from 'ol/geom/Polygon';
import { fromLonLat, toLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root'
})
export class WktService {
  private format = new WKT();
  private sceneProjection = 'EPSG:4326';

  constructor() { }

  public wktToFeature(wkt: string, epsg: string) {
    return this.format.readFeature(wkt, {
      dataProjection: this.sceneProjection,
      featureProjection: epsg
    });
  }

  public fixPolygonAntimeridian(feature: Feature<Geometry>, wkt: string) {
    const isMultiPolygon = wkt.includes('MULTIPOLYGON');
    let polygonCoordinates: Coordinate[];
    const geom = feature.getGeometry();
    if (isMultiPolygon) {
      polygonCoordinates = (geom as MultiPolygon).getPolygon(0).getCoordinates()[0];
      (geom as MultiPolygon).setCoordinates([[this.fixAntimeridianCoordinates(polygonCoordinates)]]);
    } else {
      polygonCoordinates = (geom as Polygon).getCoordinates()[0];
      (geom as Polygon).setCoordinates([this.fixAntimeridianCoordinates(polygonCoordinates)]);
    }
  }

  public fixAntimeridianCoordinates(coordinates: Coordinate[]) {
    const lons = coordinates.map(coordinate => toLonLat(coordinate)[0]);
    let new_coords = coordinates;
    if (Math.max(...lons) - Math.min(...lons) > 180) {
      new_coords = coordinates.map(coordinate => toLonLat(coordinate))
      .map(coordinate => coordinate[0] > 0 ? coordinate : [coordinate[0] + 360, coordinate[1]])
      .map(coordinate => fromLonLat(coordinate));
    }

    return new_coords;
  }

  public featureToWkt(feature, epsg: string): string {
    const geometry = feature.getGeometry();

    return this.format.writeGeometry(geometry, {
      dataProjection: this.sceneProjection,
      featureProjection: epsg,
      decimals: 4
    });
  }
}
