import * as moment from 'moment';
import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public fromResponse = (resp: any) => {
    const products = (resp.results || [])
    .map(
      (g: any): models.CMRProduct => {
        let browses: string[] = [];

        if (Array.isArray(g.browse)) {
          if (g.browse.length > 0) {
            browses = g.browse;
          } else {
            browses = ['/assets/no-browse.png'];
          }
        } else {
          if (g.browse) {
            browses = [g.browse];
          } else {
            browses = ['/assets/no-browse.png'];
          }
        }

        const thumbnail = g.thumb || (!browses[0].includes('no-browse') ? browses[0] : '/assets/no-thumb.png');

        return ({
          name: g.granuleName,
          productTypeDisplay: g.productTypeDisplay || g.granuleName,
          file: g.fileName,
          id: g.productID,
          downloadUrl: g.downloadUrl,
          bytes: g.sizeMB * 1000000,
          dataset: (g.dataset === 'STS-59' || g.dataset === 'STS-68') ? 'SIR-C' : g.dataset,
          browses,
          thumbnail,
          groupId: g.groupID,
          metadata: this.getMetadataFrom(g)
        });
      }
    );

    return products;
  }

  private getMetadataFrom =
    (g: any): models.CMRProductMetadata => ({
      date:  this.fromCMRDate(g.startTime),
      polygon: g.wkt_unwrapped,

      productType: g.productType,
      beamMode: g.beamMode,
      polarization: g.polarization,
      flightDirection: <models.FlightDirection>g.flightDirection,

      path: +g.path,
      frame:  +g.frame,
      absoluteOrbit: +g.orbit,

      faradayRotation: +g.faradayRotation,
      offNadirAngle: +g.offNadirAngle,

      missionName: g.missionName,
      flightLine: g.flightLine,
      stackSize: +g.stackSize || null,
    })

  private fromCMRDate =
    (dateString: string): moment.Moment => {
      return moment.utc(dateString);
    }
}
