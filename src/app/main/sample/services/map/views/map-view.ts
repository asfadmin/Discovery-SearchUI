import { Tile as TileLayer } from 'ol/layer';
import { View } from 'ol';

import * as proj from 'ol/proj';
import * as customProj4 from 'ol/proj/proj4';

import proj4 from 'proj4';

export class MapView {
  constructor(
    public projection: Projection,
    public view: View,
    public layer: TileLayer
  ) {}
}

export class Projection {
  constructor(public epsg: string) {}
}

export class CustomProjection extends Projection {
  constructor( epsg: string, projection: string, extent: number[]) {
    super(epsg);

    proj4.defs(this.epsg, projection);
    customProj4.register(proj4);

    proj.get(this.epsg).setExtent(extent);
  }
}
