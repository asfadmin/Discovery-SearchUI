import { Injectable } from '@angular/core';

import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';
import TileLayer from 'ol/layer/Tile';

@Injectable({
  providedIn: 'root'
})
export class LayerService {
  public coherenceLayer: TileLayer;

  constructor() { }

  public getCoherenceLayer(): TileLayer {
    return new ImageLayer({
      extent: [
        -2.00375070672E7,
        -7967398.932400003,
        2.0037507842788246E7,
        1.6213801067599997E7
      ],
      source: new ImageWMS({
        url: 'https://gis.uat.earthdata.nasa.gov/image/services/GSSICB/GSSICB_12_day_Median_VV_Coherence_Dec_Jan_Feb/ImageServer/WMSServer',
        params: {'LAYERS': 'GSSICB_12_day_Median_VV_Coherence_Dec_Jan_Feb:Scaled Coherence'},
        ratio: 1,
        serverType: 'geoserver',
      }),
    })
  }
}
