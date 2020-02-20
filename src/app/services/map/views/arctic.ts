import { View } from 'ol';
import WMTSTileGrid from 'ol/tilegrid/WMTS.js';
import { WMTS } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import * as proj from 'ol/proj';

import { MapView, CustomProjection } from './map-view';


export function arctic(): MapView  {
  const extent = [-4194304, -4194304, 4194304, 4194304];
  const projection = new CustomProjection(
    'EPSG:3413',
    '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 ' +
    '+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    extent
  );

  const view = new View({
    projection: proj.get(projection.epsg),
    extent,
    center: [0, 0],
    zoom: 2.5,
    minZoom: 2.5,
    maxZoom: 6,
  });

  const source = new WMTS({
    url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3413/best/wmts.cgi?TIME=2018-11-27T00:00:00Z',
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

  return new MapView(
    projection,
    view,
    layer
  );
}
