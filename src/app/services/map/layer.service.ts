import { Injectable } from '@angular/core';

import ImageWMS from 'ol/source/ImageWMS';
import ImageLayer from 'ol/layer/Image';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  public coherenceWMS = {
    'VV_DEC_JAN_FEB': this.gibsWMS('Dec_Jan_Feb'),
    'VV_MAR_APR_MAY': this.gibsWMS('Mar_Apr_May'),
    'VV_JUN_JUL_AUG': this.gibsWMS('Jun_Jul_Aug'),
    'VV_SEP_OCT_NOV': this.gibsWMS('Sep_Oct_Nov'),
    'VH_DEC_JAN_FEB': this.vh_wms('Dec_Jan_Feb'),
    'VH_MAR_APR_MAY': this.vh_wms('Mar_Apr_May'),
    'VH_JUN_JUL_AUG': this.vh_wms('Jun_Jul_Aug'),
    'VH_SEP_OCT_NOV': this.vh_wms('Sep_Oct_Nov'),
  }

  public coherenceLayer: ImageLayer<ImageWMS> = new ImageLayer;

  constructor() { }

  private gibsWMS(months: string): ImageWMS {

    return new ImageWMS({
      url:`https://gis.earthdata.nasa.gov/image/services/GSSICB/GSSICB_12_day_Median_VV_Coherence_${months}/ImageServer/WMSServer`,
      params: {'LAYERS': `GSSICB_12_day_Median_VV_Coherence_${months}:Unscaled Coherence`},
      ratio: 1,
      serverType: 'geoserver',
    });
  }

  public vh_wms(months: string) {
    return new ImageWMS({
      url: `https://gis.earthdata.nasa.gov/image/services/GSSICB/GSSICB_12_day_Median_VV_Coherence_${months}/ImageServer/WMSServer`,
      params: {'LAYERS': `GSSICB_12_day_Median_VV_Coherence_${months}:Unscaled Coherence`},
      ratio: 1,
      serverType: 'geoserver',
    });
  }

  public getCoherenceLayer(months: string): ImageLayer<ImageWMS> {
    return new ImageLayer({
      extent: [
        -2.00375070672E7,
        -7967398.932400003,
        2.0037507842788246E7,
        1.6213801067599997E7
      ],
      source: this.coherenceWMS[months],
    })
  }
}
