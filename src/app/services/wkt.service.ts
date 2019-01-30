import { Injectable } from '@angular/core';

import WKT from 'ol/format/WKT.js';

@Injectable({
  providedIn: 'root'
})
export class WktService {
  private format = new WKT();
  private granuleProjection = 'EPSG:4326';

  constructor() { }

  public wktToFeature(wkt: string, epsg: string) {
    return this.format.readFeature(wkt, {
      dataProjection: this.granuleProjection,
      featureProjection: epsg
    });
  }

  public featureToWkt(feature, epsg: string): string {
    const geometry = feature.getGeometry();

    return this.format.writeGeometry(geometry, {
      dataProjection: this.granuleProjection,
      featureProjection: epsg
    });
  }
}
