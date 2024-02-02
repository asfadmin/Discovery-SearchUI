import * as moment from 'moment';
import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public fromResponse = (resp: any): models.CMRProduct[] => {
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
          isDummyProduct: false,
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
      subproducts: [],
      parentID: null
    })

  private isNumber = n => !isNaN(n) && isFinite(n);
  private fromCMRDate =
    (dateString: string): moment.Moment => {
      return moment.utc(dateString);
    }

    private getSubproducts(product: models.CMRProduct): models.CMRProduct[] {
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
          productType: product.metadata.productType + '_XML',
          subproducts: [],
          parentID: product.id,
        },
      } as models.CMRProduct;

      return p;
    }

    private operaProductTypeDisplays = {
      hh: 'HH GeoTIFF',
      hv: 'HV GeoTIFF',
      vv: 'VV GeoTIFF',
      vh: 'VH GeoTIFF',
      mask: 'Mask GeoTIFF',
      h5: 'HDF5',
      xml: 'Metadata XML',
      rtc_anf_gamma0_to_sigma0: 'RTC Gamma to Sigma GeoTIFF',
      number_of_looks: '# of Looks GeoTIFF',
      incidence_angle: 'Incidence Angle GeoTIFF',
      rtc_anf_gamma0_to_beta0: 'RTC Gamm to Beta GeoTIFF',
      local_incidence_angle: 'Local Incidence Angle GeoTIFF'
    }

    private operaSubproductsFromScene(product: models.CMRProduct) {
      if (!!product.metadata.opera?.validityStartDate) {
        product.metadata.opera.validityStartDate = this.fromCMRDate(
        (product.metadata.opera?.validityStartDate as unknown) as string)
      }
      let products = []

      let reg = product.downloadUrl.split(/(_v[0-9]\.[0-9]){1}(\.(\w*)|(_(\w*(_*))*.))*/);
      let file_suffix = !!reg[3] ? reg[3] : reg[5]
      product.productTypeDisplay = this.operaProductTypeDisplays[file_suffix.toLowerCase()]

      const thumbnail_index = product.browses.findIndex(url => url.toLowerCase().includes('thumbnail'))
      if (thumbnail_index !== -1) {
        product.thumbnail = product.browses.splice(thumbnail_index, 1)[0];
      }
      product.browses = product.browses.filter(url => !url.includes('low-res'));


      for (const p of product.metadata.opera.additionalUrls.filter(url => url !== product.downloadUrl)) {
        reg = p.split(/(_v[0-9]\.[0-9]){1}(\.(\w*)|(_(\w*(_*))*.))*/);
        file_suffix = !!reg[3] ? reg[3] : reg[5]
        const productTypeDisplay = this.operaProductTypeDisplays[file_suffix.toLowerCase()];

        const fileID = p.split('/').slice(-1)[0]

        let subproduct =  {
          ...product,
          downloadUrl: p,
          productTypeDisplay: productTypeDisplay || p,
          file: fileID,
          id: product.id + '-' + file_suffix,
          bytes: 0,
          browses: [],
          thumbnail: null,
          metadata: {
            ...product.metadata,
            productType: product.metadata.productType,
            parentID: product.id,
            subproducts: []
          },
        } as models.CMRProduct;

          products.push(subproduct)
      }

      return products.sort((a, b) => {
        if(['hh', 'vv', 'vh', 'hv'].includes(a.productTypeDisplay.slice(0, 2).toLowerCase())) {
          return -1;
        } else if(['hh', 'vv', 'vh', 'hv'].includes(b.productTypeDisplay.slice(0, 2).toLowerCase()))
        return 1;

        return a.productTypeDisplay < b.productTypeDisplay ? -1 : 1
      }
      )
    }
}
