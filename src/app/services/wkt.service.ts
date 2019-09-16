import { Injectable } from '@angular/core';

import WKT from 'ol/format/WKT.js';

@Injectable({
  providedIn: 'root'
})
export class WktService {
  private format = new WKT();
  private sceneProjection = 'EPSG:4326';

  constructor() { }

  public wktToFeature(wkt: string, epsg: string) {
    return this.format.readFeature(wkt, {
      dataProjection: this.sceneProjection,
      featureProjection: epsg
    });
  }

  public featureToWkt(feature, epsg: string): string {
    const geometry = feature.getGeometry();

    return this.format.writeGeometry(geometry, {
      dataProjection: this.sceneProjection,
      featureProjection: epsg,
      decimals: 6
    });
  }
}
