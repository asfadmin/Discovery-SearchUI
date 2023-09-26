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
        if ( !filename.includes(g.gn)) {
          filename = `${g.gn}-${filename}`;
        }
        let product = {
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
        };

        product.metadata.subproducts = this.getSubproducts(product)
        return product;
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
      burst: g.s1b ? g.s1b : null,
      opera: g.s1o ? g.s1o : null,
      pgeVersion: g.pge !== null ? parseFloat(g.pge) : null,
      subproducts: []
    })

  private isNumber = n => !isNaN(n) && isFinite(n);
  private fromCMRDate =
    (dateString: string): moment.Moment => {
      return moment.utc(dateString);
    }
  
    private getSubproducts(product: models.CMRProduct): models.CMRSubProduct[] {
      if (product.metadata.productType === 'BURST') {
        return [this.burstXMLFromScene(product)]
      }
      if (!!product.metadata.opera) {
        return this.operaSubproductsFromScene(product)
      }
      return []
    }


    private burstXMLFromScene(product: models.CMRProduct) {
      let p =  {
        ...product,
        downloadUrl: product.downloadUrl.replace('tiff', 'xml'),
        productTypeDisplay: 'XML Metadata (BURST)',
        file: product.file.replace('tiff', 'xml'),
        id: product.id + '-XML',
        bytes: 0,
        metadata: {
          ...product.metadata,
          productType: product.metadata.productType + '_XML'
        },
        parentID: product.id
      } as models.CMRSubProduct;
    
      return p;
    }

    private operaSubproductsFromScene(product: models.CMRProduct) {
      let products = []
      // incidence_angle
      // local_incidence_angle
      // mask
      // number_of_looks
      // rtc_anf_gamma0_to_beta0
      // rtc_anf_gamma0_to_sigma0

      // product_types = [
      //   'incidence_angle',
      //   'local_incidence_angle',
      //   'mask',
      //   'number_of_looks',
      //   'rtc_anf_gamma0_to_beta0',
      //   'rtc_anf_gamma0_to_sigma0',
      // ]
      const display = {
        'incidence_angle': 'Incidence Angle (TIF)',
        'local_incidence_angle': 'Local Incidence Angle (TIF)',
        'mask': 'Mask (TIF)',
        'number_of_looks': 'Number of Looks (TIF)',
        'rtc_anf_gamma0_to_beta0': 'RTC Anf Gamma0 to Beta0 (TIF)',
        'rtc_anf_gamma0_to_sigma0': 'RTC Anf Gamma0 to Sigma0 (TIF)',
      }
      for (const p of product.metadata.opera.additionalUrls) {
        const file_suffix = p.split('v0.')[1]
        const fileID = 'v0.' + file_suffix
        const file_name = file_suffix.slice(2, file_suffix.length - 4)
        console.log(file_name)
        let subproduct =  {
          ...product,
          downloadUrl: p,
          productTypeDisplay: display[file_name] || 'Opera Subproduct',
          file: fileID,
          id: product.id + '-' + file_name,
          bytes: 0,
          metadata: {
            ...product.metadata,
            productType: product.metadata.productType + '_TIF'
          },
          parentID: product.id
        } as models.CMRSubProduct;

        if(subproduct.productTypeDisplay !== 'Opera Subproduct') {
          products.push(subproduct)
        }
      }

      return products
    }
}
