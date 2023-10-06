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
        product.productTypeDisplay = this.operaProductTypeDisplay(product.downloadUrl)
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

    private operaSubproductsFromScene(product: models.CMRProduct) {
      let products = []
      
      let file_suffix = product.downloadUrl.split(/(_v)\w+.*_/).slice(-1)[0]
      let file_name = file_suffix.endsWith('h5') ? 'H5' : file_suffix.split('.').slice(0, -1).join('.')
      product.productTypeDisplay = file_name
      
      for (const p of product.metadata.opera.additionalUrls.slice(1)) {
        file_suffix = p.split(/(_v)\w+.*_/).slice(-1)[0]
        file_name = file_suffix.endsWith('h5') ? 'H5' : file_suffix.split('.').slice(0, -1).join('.')
        
        const fileID = p.split('/').slice(-1)[0]

        let subproduct =  {
          ...product,
          downloadUrl: p,
          productTypeDisplay: file_name,
          file: fileID,
          id: product.id + '-' + file_name,
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

      return products
    }

    operaProductTypeDisplay(p: string) {
      const file_suffix = p.split(/(_v)\w+.*_/).slice(-1)[0]
      const file_name = file_suffix.slice(0, file_suffix.length - 4)
      const extension = p.split('.').slice(-1)[0]
      const fileDisplay = file_name.replace('_', ' ').toLowerCase() + ` (${extension.toUpperCase()})`
      
      return fileDisplay
    }
}
