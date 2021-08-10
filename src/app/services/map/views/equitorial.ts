import { View } from 'ol';
import { XYZ } from 'ol/source';
import { Tile as TileLayer, Graticule as GraticuleLayer } from 'ol/layer';
import * as proj from 'ol/proj';
import { Stroke } from 'ol/style';
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

  const graticule = new GraticuleLayer({
    strokeStyle: new Stroke({
      color: 'rgba(255,120,0,0.9)',
      width: 2,
      lineDash: [0.5, 4],
    }),
    showLabels: true,
    wrapX: false,
  })
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
  return equatorialView(
    `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=bFwkahiCrAA0526OlsHS`
  );
}


export function equatorialStreet(): MapView {

  return equatorialView(
   'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=bFwkahiCrAA0526OlsHS'
  );
}
