import { Tile as TileLayer, Graticule as GraticuleLayer } from 'ol/layer';
import { View } from 'ol';
import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';
import { Extent } from 'ol/extent';
import { TileImage } from 'ol/source';

export class MapView {
  constructor(
    public projection: Projection,
    public view: View,
    public layer: TileLayer<TileImage>,
    public gridlines?: GraticuleLayer
  ) {}
}

export class Projection {
  constructor(public epsg: string) {}
}

export class CustomProjection extends Projection {
  constructor( epsg: string, projection: string, extent: Extent) {
    super(epsg);

    proj4.defs(this.epsg, projection);
    customProj4.register(proj4);

    proj.get(this.epsg).setExtent(extent);
  }
}
