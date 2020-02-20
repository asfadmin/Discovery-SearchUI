import { View } from 'ol';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { WMTS } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import * as proj from 'ol/proj';

import { MapView, CustomProjection } from './map-view';

export function antarctic(): MapView {
  const extent = [-4194304, -4194304, 4194304, 4194304];
  const projection = new CustomProjection(
    'EPSG:3031',
    '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 ' +
    '+datum=WGS84 +units=m +no_defs',
    extent
  );

  const source = new WMTS({
    url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3031/best/wmts.cgi?TIME=2018-11-27T00:00:00Z',
    layer: 'BlueMarble_ShadedRelief_Bathymetry',
    format: 'image/jpeg',
    matrixSet: '500m',

    tileGrid: new WMTSTileGrid({
      origin: [-4194304, 4194304],
      resolutions: [
        8192.0, 4096.0, 2048.0, 1024.0, 512.0, 256.0
      ],
      matrixIds: [0, 1, 2, 3, 4, 5],
      tileSize: 512
    })
  });

  const layer = new TileLayer({ source, extent });

  const view = new View({
    center: proj.transform([0, -90], 'EPSG:4326', projection.epsg),
    projection: proj.get(projection.epsg),
    zoom: 2.5,
    minZoom: 2.5,
    maxZoom: 6,
    extent,
  });

  return new MapView(
    projection,
    view,
    layer
  );
}
