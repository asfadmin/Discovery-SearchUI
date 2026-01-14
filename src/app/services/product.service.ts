import * as moment from 'moment';
import { inject, Injectable } from '@angular/core';

import * as models from '@models';
import { SubproductService } from './subproduct.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private subproductService = inject(SubproductService);
  public fromResponse = (resp: any): models.CMRProduct[] => {
    const products = (resp.results || []).map((g: any): models.CMRProduct => {
      let browses: string[] = [];

      if (Array.isArray(g.b)) {
        if (g.b.length > 0) {
          browses = g.b.map((b: any): string => {
            return b.replaceAll('{gn}', g.gn);
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

      const thumbnail =
        (g.t ? g.t.replaceAll('{gn}', g.gn) : g.t) ||
        (!browses[0].includes('no-browse')
          ? browses[0].replaceAll('{gn}', g.gn)
          : '/assets/no-thumb.png');
      let filename = g.fn.replaceAll('{gn}', g.gn);
      if (!filename.includes(g.gn)) {
        filename = `${g.gn}-${filename}`;
      }
      if (g.d === 'NISAR' && g.nsr.sizeMB) {
        // NISAR uses SizeInBytes instead of Size so doesn't populate the right field in the API.
        // the new property also auto converts to the right scale already
        g.s = (g.nsr.sizeMB[filename]?.bytes ?? 0) / 1000000;
      }
      const product = {
        name: g.gn,
        productTypeDisplay: g.ptd ?? g.gn,
        file: filename,
        id: g.pid.replaceAll('{gn}', g.gn),
        downloadUrl: g.du.replaceAll('{gn}', g.gn),
        bytes: g.s * 1000000,
        dataset: g.d === 'STS-59' || g.d === 'STS-68' ? 'SIR-C' : g.d,
        browses,
        thumbnail,
        groupId: g.gid.replaceAll('{gn}', g.gn),
        isUnzippedFile: false,
        isDummyProduct: false,
        metadata: this.getMetadataFrom(g),
      };

      product.metadata.subproducts =
        this.subproductService.getSubproducts(product);

      return product;
    });

    return products;
  };

  private getMetadataFrom = (g: any): models.CMRProductMetadata => ({
    date: this.fromCMRDate(g.st),
    stopDate: this.fromCMRDate(g.stp),
    polygon: g.wu,

    productType: g.pt,
    beamMode: g.bm,
    polarization: g.po,
    flightDirection: g.fd as models.FlightDirection,

    path: +g.p,
    frame: +g.f,
    absoluteOrbit: Array.isArray(g.o)
      ? g.o.map((val) => +val)
      : g.o !== null
        ? [+g.o]
        : [],

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
    burst: g.s1b ? g.s1b : null,
    opera: g.s1o ? g.s1o : null,
    nisar: g.nsr ? g.nsr : null,
    pgeVersion: g.pge !== null ? g.pge : null,
    subproducts: [],
    parentID: null,
    s3URI: null,
    s3Urls: g.s3u || [],
    additionalUrls: g.adu || [],
    fileSizes: isNaN(g.bytes) ? g.s : null,
    ariaVersion: g.ariav ? g.ariav : null,
    collectionName: g?.cnm,
    collectionID: g?.cid,
  });

  private isNumber = (n) => !isNaN(n) && isFinite(n);
  private fromCMRDate = (dateString: string): moment.Moment => {
    return moment.utc(dateString);
  };
}
