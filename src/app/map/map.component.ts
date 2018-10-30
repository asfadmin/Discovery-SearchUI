import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Map, View } from 'ol';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import { OSM, Vector as VectorSource, TileWMS, Layer } from 'ol/source';
import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

import { SentinelGranule } from '../models/sentinel-granule.model';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<SentinelGranule[]>;
  private projection;
  private map: Map;

  ngOnInit() {
    this.registerCustomProjections();

    this.equatorial();

    this.granulePolygonsLayer()
      .subscribe(
        layer => this.map.addLayer(layer)
      );
  }

  private equatorial(): void {
    this.projection = 'EPSG:3857';
    this.map = this.olMap(new OSM(), this.projection, 0);
  }

  private antarctic(): Map {
    this.projection = 'EPSG:3031';
    const antarcticLayer = new TileWMS({
      url:  'https://mapserver-prod.asf.alaska.edu/wms/amm',
      params: { LAYERS: '8bit', CRS: this.projection, transparent: true },
      serverType: 'geoserver'
    });

    this.map = this.olMap(antarcticLayer, this.projection, 4);
  }

  private arctic(): Map {
    this.projection = 'EPSG:3572';
    this.map = this.olMap(new OSM(), this.projection, 3);
  }

  private olMap(source: Layer, projectionEPSG: string, zoom: number): Map {
    return new Map({
      layers: [
        new TileLayer({ source })
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        projection: proj.get(projectionEPSG),
        maxResolution: 25000,
        zoom
      }),
      controls: [],
    });
  }

  private granulePolygonsLayer(): Observable<VectorSource> {
    const wktFormat = new WKT();
    const granuleProjection = 'EPSG:4326';

    return this.granules$.pipe(
      map(granules => granules
        .map(g => g.wktPoly)
        .map(wkt =>
          wktFormat.readFeature(wkt, {
            dataProjection: granuleProjection,
            featureProjection: this.projection
          })
        )
      ),
      map(features => new VectorLayer({
        source: new VectorSource({ features })
      }))
    );
  }

  private registerCustomProjections(): void {
    proj4.defs(
      'EPSG:3413',
      '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
      '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:3572',
      '+title=Alaska Albers +proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0' +
      ' +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    proj4.defs(
      'EPSG:3031',
      '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 ' +
      '+ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    customProj4.register(proj4);
  }
}
