import { View } from 'ol';
import { XYZ } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import * as proj from 'ol/proj';

import { MapView, Projection } from './map-view';
import * as models from '@models';

export function equatorial(): MapView {
  const projection = new Projection('EPSG:3857');

  const token = 'pk.eyJ1IjoiZ2xzaG9ydCIsImEiOiJjandjYXA2aWIwN3hyM3luem9qOTk0aWNoIn0.ZaWtqY0yjcp86Nsfzw47Cg';
  const styleUrl = 'williamh890/cjo0daohlaa972smsrpr0ow4d';
  const url = `https://api.mapbox.com/styles/v1/${styleUrl}/tiles/{z}/{x}/{y}?access_token=${token}`;

  const source = new XYZ({
    url,
    wrapX: models.mapOptions.wrapX
  });

  const layer = new TileLayer({ source });

  const view = new View({
    center: [-10852977.98, 4818505.78],
    projection: projection.epsg,
    zoom: 4,
    minZoom: 4,
    maxZoom: 13,
    extent: proj.transformExtent(
      [-Number.MAX_VALUE, -90, Number.MAX_VALUE, 90],
      'EPSG:4326', projection.epsg
    )
  });

  return new MapView(
    projection,
    view,
    layer
  );
}


export function equatorialStreet(): MapView {
  const projection = new Projection('EPSG:3857');

  const token = 'pk.eyJ1IjoiZ2xzaG9ydCIsImEiOiJjandjYXA2aWIwN3hyM3luem9qOTk0aWNoIn0.ZaWtqY0yjcp86Nsfzw47Cg';
  const styleUrl = 'williamh890/cjwtwkv9m02ua1crzhhcybaq7';
  const url = `https://api.mapbox.com/styles/v1/${styleUrl}/tiles/{z}/{x}/{y}?access_token=${token}`;

  const source = new XYZ({
    url,
    wrapX: models.mapOptions.wrapX
  });

  const layer = new TileLayer({ source });

  const view = new View({
    center: [-10852977.98, 4818505.78],
    projection: projection.epsg,
    zoom: 4,
    minZoom: 4,
    maxZoom: 13,
    extent: proj.transformExtent(
      [-Number.MAX_VALUE, -90, Number.MAX_VALUE, 90],
      'EPSG:4326', projection.epsg
    )
  });

  return new MapView(
    projection,
    view,
    layer
  );
}
