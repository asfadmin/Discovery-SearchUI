import { View } from 'ol';
import { XYZ } from 'ol/source';
import { Graticule as GraticuleLayer } from 'ol/layer';
import TileLayer from 'ol/layer/WebGLTile.js';

import * as proj from 'ol/proj';
import { Stroke, Text } from 'ol/style';
import { MapView, Projection } from './map-view';
import * as models from '@models';


function equatorialView(url: string): MapView {
  const projection = new Projection('EPSG:3857');
  const source = new XYZ({
    url,
    wrapX: models.mapOptions.wrapX,
    tileSize: [512, 512]
  });

  const layer = new TileLayer({ source });

  const lonFormatter = function(lon: number) {
    let formattedLon = Math.abs(Math.round(lon * 100) / 100).toString() + String.fromCharCode(176) + ' ';
    formattedLon += (lon < 0) ? 'W' : ((lon > 0) ? 'E' : '');
    return formattedLon;
  };

  const latFormatter = function(lat: number) {
    let formattedLat = Math.abs(Math.round(lat * 100) / 100).toString() + String.fromCharCode(176) + ' ';
    formattedLat += (lat < 0) ? 'S' : ((lat > 0) ? 'N' : '');
    return formattedLat;
  };

  const latLonLabelStyle = new Text({
    font: '16px Roboto,sans-serif',
    textBaseline: 'bottom',
    stroke: new Stroke({
      color: 'rgba(255,255,255,1)',
      width: 3
    })
  });

  const strokeStyle = url.includes('streets') ?
    new Stroke({
      color: 'rgba(0, 0, 0,0.5)',
      width: 1.5,
    }) :
    new Stroke({
      color: 'rgba(255,255,255,0.5)',
      width: 1.5,
    });

  const graticule = new GraticuleLayer({
    strokeStyle,
    latLabelStyle: latLonLabelStyle,
    lonLabelStyle: latLonLabelStyle,
    intervals: [90, 45, 30, 20, 10, 5, 2],
    targetSize: 200,
    showLabels: true,
    wrapX: models.mapOptions.wrapX,
    lonLabelPosition: .9,
    latLabelPosition: .95,
    lonLabelFormatter: lonFormatter,
    latLabelFormatter: latFormatter,
    extent: proj.transformExtent(
      [-Number.MAX_VALUE, -90, Number.MAX_VALUE, 90],
      'EPSG:4326', projection.epsg
    ),
    maxLines: 10,
  });

  graticule.set('ol_uid', '100');

  const view = new View({
    center: [-10852977.98, 4818505.78],
    projection: projection.epsg,
    zoom: 3,
    minZoom: 3,
    maxZoom: 13,
    extent: proj.transformExtent(
      [-Number.MAX_VALUE, -90, Number.MAX_VALUE, 90],
      'EPSG:4326', projection.epsg
    )
  });

  return new MapView(
    projection,
    view,
    layer,
    graticule
  );
}

export function equatorial(): MapView {
  const style = 'styles/v1/asf-discovery/clhz19vdp000y01ok3smcelx1';
  return equatorialView(
    `https://api.mapbox.com/${style}/tiles/{z}/{x}/{y}?access_token=${models.mapboxToken}`
  );
}


export function equatorialStreet(): MapView {
  const style = 'styles/v1/asf-discovery/clhz1c9tt004a01o7c2ut9fss';

  return equatorialView(
    `https://api.mapbox.com/${style}/tiles/{z}/{x}/{y}?access_token=${models.mapboxToken}`
  );
}
