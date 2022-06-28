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

        if (Array.isArray(g.b)) {
          if (g.b.length > 0) {
            browses = g.b.map(
              (b: any): string => {
                return (b.replace('{gn}', g.gn));
            });
          } else {
            browses = ['/assets/no-browse.png'];
          }
        } else {
          if (g.b) {
            browses = [g.b];
          } else {
            browses = ['/assets/no-browse.png'];
          }
        }

        const thumbnail = (g.t ? g.t.replace('{gn}', g.gn) : g.t) || (!browses[0].includes('no-browse') ? browses[0].replace('{gn}', g.gn) : '/assets/no-thumb.png');
        let filename = g.fn.replace('{gn}', g.gn);
        if( !filename.includes(g.gn)){
          filename = `${g.gn}-${filename}`;
        }
        return ({
          name: g.gn,
          productTypeDisplay: g.ptd || g.gn,
          file: filename,
          id: g.pid.replace('{gn}', g.gn),
          downloadUrl: g.du.replace('{gn}', g.gn),
          bytes: g.s * 1000000,
          dataset: (g.d === 'STS-59' || g.d === 'STS-68') ? 'SIR-C' : g.d,
          browses,
          thumbnail,
          groupId: g.gid.replace('{gn}', g.gn),
          isUnzippedFile: false,
          metadata: this.getMetadataFrom(g)
        });
      }
    );

    return products;
  }

  private getMetadataFrom =
    (g: any): models.CMRProductMetadata => ({
      date:  this.fromCMRDate(g.st),
      stopDate:  this.fromCMRDate(g.stp),
      polygon: g.wu,

      productType: g.pt,
      beamMode: g.bm,
      polarization: g.po,
      flightDirection: <models.FlightDirection>g.fd,

      path: +g.p,
      frame:  +g.f,
      absoluteOrbit: Array.isArray(g.o) ? g.o.map(val => +val) : [+g.o],

      faradayRotation: +g.fr,
      offNadirAngle: +g.on,

      instrument: g.i,
      pointingAngle: g.pa,

      missionName: g.mn,
      flightLine: g.fl,
      stackSize: +g.ss || null,

      perpendicular: this.isNumber(+g.pb) ? +g.pb : null,
      temporal: this.isNumber(+g.tb) ? +g.tb : null,
      canInSAR: g.in,
      job: null,
      fileName: null,
    })

  private isNumber = n => !isNaN(n) && isFinite(n);
  private fromCMRDate =
    (dateString: string): moment.Moment => {
      return moment.utc(dateString);
    }
}
