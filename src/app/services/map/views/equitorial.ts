import { View } from 'ol';
import { XYZ } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import * as proj from 'ol/proj';

import { MapView, Projection } from './map-view';

export function equatorial(): MapView {
  const projection = new Projection('EPSG:3857');

  const token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  const styleUrl = 'williamh890/cjo0daohlaa972smsrpr0ow4d';
  const url = `https://api.mapbox.com/styles/v1/${styleUrl}/tiles/{z}/{x}/{y}?access_token=${token}`;

  const source = new XYZ({
    url,
    wrapX: false,
    noWrap: true,
  });

  const layer = new TileLayer({ source });

  const view = new View({
    center: [0, 0],
    projection: projection.epsg,
    zoom: 3,
    minZoom: 3,
    maxZoom: 13,
    extent: proj.transformExtent([-180, -90, 180, 90], 'EPSG:4326', projection.epsg)
  });

  return new MapView(
    projection,
    view,
    layer
  );
}
