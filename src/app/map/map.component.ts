import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import WKT from 'ol/format/WKT.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source';
import Projection from 'ol/proj/Projection';
import register from 'ol/proj/proj4.js';
import * as proj from 'ol/proj';
import * as olproj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

import { SentinelGranule } from '../models/sentinel-granule.model';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() granules$: Observable<SentinelGranule[]>;
  map: Map;

  ngOnInit() {
    this.map = this.northPolarMap();

    this.granulePolygonsLayer()
      .subscribe(
        layer => this.map.addLayer(layer)
      );
  }

  private northPolarMap() {
    proj4.defs(
      'EPSG:3572',
      '+title=Alaska Albers +proj=laea +lat_0=90 +lon_0=-150 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs'
    );
    olproj4.register(proj4);

    const destProj = proj.get('EPSG:3572');

    const layers = [
      new TileLayer({
        source: new OSM()
      })
    ];

    return new Map({
      layers: layers,
      target: 'map',
      view: new View({
        center: [0, 0],
        projection: destProj,
        zoom: 4
      })
    });
  }

  private granulePolygonsLayer(): Observable<VectorSource> {
    const format = new WKT();

    return this.granules$.pipe(
      map(granules => granules
        .map(g => g.wktPoly)
        .map(wkt => format.readFeature(wkt, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3572' }))
      ),
      map(features => new VectorLayer({
        source: new VectorSource({ features })
      }))
    );
  }
}
