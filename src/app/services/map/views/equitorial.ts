import { View } from 'ol';
import { XYZ } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer';
import * as proj from 'ol/proj';

import { MapView, Projection } from './map-view';
import * as models from '@models';

export function equatorial(): MapView {
  const projection = new Projection('EPSG:3857');

  const url = `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=QrAuZe6sPNqfQ8e0YRvp`;

  const source = new XYZ({
    url,
    wrapX: models.mapOptions.wrapX
  });

  const layer = new TileLayer({ source });

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
    layer
  );
}


export function equatorialStreet(): MapView {
  const projection = new Projection('EPSG:3857');

  const url = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=QrAuZe6sPNqfQ8e0YRvp`;

  const source = new XYZ({
    url,
    wrapX: models.mapOptions.wrapX
  });

  const layer = new TileLayer({ source });

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
    layer
  );
}
