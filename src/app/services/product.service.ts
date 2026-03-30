import * as moment from 'moment';
import { Injectable } from '@angular/core';

import * as models from '@models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
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

      product.metadata.subproducts = this.getSubproducts(product);

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
      ? g.o.map((val) => +val).filter((x) => !isNaN(x))
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

  private getSubproducts(product: models.CMRProduct): models.CMRProduct[] {
    if (product.metadata?.productType === 'BURST') {
      return [this.burstXMLFromScene(product)];
    }
    if (product.metadata?.opera) {
      return this.operaSubproductsFromScene(product);
    }
    if (product.dataset === 'NISAR') {
      return this.nisarSubproductsFromScene(product);
    }
    if (product.dataset === 'SEASAT 1') {
      return this.seasatSubproductsFromScene(product);
    }
    if (
      models.tropo.productTypes
        .map((t) => t.apiValue)
        .includes(product.metadata.productType)
    ) {
      return this.tropoSubproductsFromScene(product);
    }
    return [];
  }

  public urlToProductType(
    url: string,
    productTypeDisplay: Record<string, string>,
  ) {
    const regex = /(_v[0-9]\.[0-9]){1}(\.(\w*)|(_(\w*(_*))*.))*/;

    if (url) {
      if (url.startsWith('https://cumulus')) {
        const file = url.split('/').pop().split('.');

        const file_extension = file.pop();

        // Grabs the part of the file after version number to see if it matches a predefined product type
        const file_type = file
          .join('.')
          .split(/[0-9]\.[0-9]_/)
          .pop();

        if (file_type === undefined) {
          return 'null';
        }
        if (!productTypeDisplay.hasOwnProperty(file_type.toLowerCase())) {
          return file_extension;
        }
        return file_type;
      }
      const reg = url.split(regex);
      return reg[3] ? reg[3] : reg[5];
    } else {
      return 'null';
    }
  }
  private burstXMLFromScene(product: models.CMRProduct) {
    const p = {
      ...product,
      downloadUrl: product.downloadUrl.replaceAll('tiff', 'xml'),
      productTypeDisplay: 'XML Metadata (BURST)',
      file: product.file.replaceAll('tiff', 'xml'),
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
    product.metadata.s3URI = product.metadata.opera.s3Urls[0];
    if (product.metadata.opera?.validityStartDate) {
      product.metadata.opera.validityStartDate = this.fromCMRDate(
        product.metadata.opera?.validityStartDate as unknown as string,
      );
    }
    const products = [];

    let file_suffix = '';

    if ('DISP-S1' === product.metadata.productType) {
      file_suffix = 'nc';
    } else if ('DISP-S1-STATIC' === product.metadata.productType) {
      file_suffix = 'dem';
    } else {
      file_suffix = this.urlToProductType(
        product.downloadUrl,
        models.opera_s1.productTypeDisplays,
      );
    }

    product.productTypeDisplay =
      models.opera_s1.productTypeDisplays[file_suffix?.toLowerCase()] ??
      'Download';

    if (product.metadata.productType === 'DIST-ALERT-S1') {
      product.productTypeDisplay =
        this.operaDistDisplayMap[
          Object.keys(this.operaDistDisplayMap).find((key) =>
            product.downloadUrl.includes(key),
          )
        ];
    }

    const thumbnail_index = product.browses.findIndex((url) =>
      url.toLowerCase().includes('thumbnail'),
    );
    if (thumbnail_index !== -1) {
      product.thumbnail = product.browses.splice(thumbnail_index, 1)[0];
    }

    const s3Index = product.metadata.opera.s3Urls.findIndex((uri) =>
      uri.toLowerCase().endsWith(file_suffix),
    );

    if (s3Index !== -1) {
      product.metadata.s3URI = product.metadata.opera.s3Urls[s3Index];
    }
    product.browses = product.browses.filter((url) => !url.includes('low-res'));

    for (const p of product.metadata.opera.additionalUrls.filter(
      (url) => url !== product.downloadUrl,
    )) {
      file_suffix = this.urlToProductType(
        p,
        models.opera_s1.productTypeDisplays,
      );

      let productTypeDisplay =
        models.opera_s1.productTypeDisplays[file_suffix?.toLowerCase()];
      if (
        product.metadata.productType === 'DISP-S1' &&
        productTypeDisplay == null
      ) {
        if (p.includes('short_wavelength')) {
          productTypeDisplay = 'Frame(Short Wavelength) Zarr Store';
        } else {
          productTypeDisplay = 'Product Zarr Store';
        }
      } else if (product.metadata.productType === 'DISP-S1-STATIC') {
        if (p.includes('line_of_sight')) {
          productTypeDisplay = 'Line Of Sight GeoTIFF';
        } else if (p.includes('layover_shadow_mask')) {
          productTypeDisplay = 'Shadow Mask GeoTIFF';
        }
      } else if (product.metadata.productType === 'DIST-ALERT-S1') {
        for (const key of Object.keys(this.operaDistDisplayMap)) {
          if (p.includes(key)) {
            productTypeDisplay = this.operaDistDisplayMap[key];
          }
        }
      }
      const fileID = p.split('/').slice(-1)[0];

      let s3Uri = null;
      const s3uriIndex = product.metadata.opera.s3Urls.findIndex(
        (x) => x.split('/').slice(-1)[0] === fileID,
      );
      if (s3uriIndex !== -1) {
        s3Uri = product.metadata.opera.s3Urls[s3uriIndex];
      }
      const subproduct = this.createSubproductForScene(
        product,
        p,
        s3Uri,
        file_suffix,
        productTypeDisplay,
        0,
        [],
      );
      products.push(subproduct);
    }

    return products.sort((a, b) => {
      if (
        ['hh', 'vv', 'vh', 'hv'].includes(
          a.productTypeDisplay.slice(0, 2).toLowerCase(),
        )
      ) {
        return -1;
      } else if (
        ['hh', 'vv', 'vh', 'hv'].includes(
          b.productTypeDisplay.slice(0, 2).toLowerCase(),
        )
      )
        return 1;
      else if (product.metadata.productType === 'DIST-ALERT-S1') {
        const idxA = this.operaDistDisplayValues.findIndex(
          (x) => x === a.productTypeDisplay,
        );
        const idxB = this.operaDistDisplayValues.findIndex(
          (x) => x === b.productTypeDisplay,
        );
        return idxA < idxB ? -1 : 1;
      }
      return a.productTypeDisplay < b.productTypeDisplay ? -1 : 1;
    });
  }
  private operaDistDisplayMap = {
    'DIST-STATUS': 'Disturbance Status TIF',
    'STATUS-ACQ': 'Disturbance Status Latest TIF',
    'GEN-METRIC': 'Current Metric Anomaly TIF',
    'METRIC-MAX': 'Maximum Metric Anomaly TIF',
    'DIST-CONF': 'Generic Disturbance Confidence TIF',
    'DIST-DATE': 'Date of First Disturbance TIF',
    'DIST-COUNT': 'Number of Disturbances TIF',
    'DIST-PERC': 'Percentage of Disturbances TIF',
    'DIST-DUR.': 'Disturbance Duration TIF',
    'LAST-DATE': 'Date of Last Observation Assessed TIF',
    xml: 'Metadata XML',
  };

  private operaDistDisplayValues = Object.values(this.operaDistDisplayMap);
  private tropoSubproductsFromScene(product: models.CMRProduct) {
    const products = [];
    let file_extension = this.urlToProductType(
      product.downloadUrl,
      models.tropo.productTypeDisplays,
    );
    product.productTypeDisplay =
      models.tropo.productTypeDisplays[file_extension];
    const fileID = product.downloadUrl.split('/').slice(-1)[0];
    product.bytes = product.metadata.fileSizes[fileID]?.bytes;
    const thumbnail_index = product.browses.findIndex((url) =>
      url.toLowerCase().includes('thumbnail'),
    );
    if (thumbnail_index !== -1) {
      product.thumbnail = product.browses.splice(thumbnail_index, 1)[0];
    }
    product.browses = product.browses.filter((url) => !url.includes('low-res'));

    const s3UrlsByProductID = product.metadata.s3Urls.reduce((prev, curr) => {
      const subproductFileID = curr.split('/').at(-1);

      prev[subproductFileID] = curr;

      return prev;
    }, {});

    product.metadata.s3URI = s3UrlsByProductID[product.file] ?? null;

    const browses = [];
    for (const p of [
      ...product.metadata.additionalUrls.filter(
        (url) => url !== product.downloadUrl,
      ),
      ...product.browses,
    ]) {
      file_extension = this.urlToProductType(
        p,
        models.tropo.productTypeDisplays,
      );

      if (p === '/assets/no-browse.png') {
        continue;
      }
      const productTypeDisplay =
        models.tropo.productTypeDisplays[file_extension.toLowerCase()] ??
        'Missing Display';

      if (productTypeDisplay === 'Missing Display') {
        console.log(
          `Missing product type display for file extension "${file_extension}"`,
        );
      }

      if (['Metadata IN'].includes(productTypeDisplay)) {
        continue;
      }

      const fileID = p.split('/').slice(-1)[0];
      const s3Url = s3UrlsByProductID[fileID] ?? null;
      const fileSize = product.metadata.fileSizes[fileID]?.bytes ?? 0;
      const subproduct = this.createSubproductForScene(
        product,
        p,
        s3Url,
        file_extension,
        productTypeDisplay,
        fileSize,
        browses,
      );

      products.push(subproduct);
    }

    return products;
  }
  private seasatSubproductsFromScene(product: models.CMRProduct) {
    const products = [];
    let file_extension = this.urlToProductType(
      product.downloadUrl,
      models.seasat.productTypeDisplays,
    );
    product.productTypeDisplay =
      models.seasat.productTypeDisplays[file_extension];
    const fileID = product.downloadUrl.split('/').slice(-1)[0];
    product.bytes = product.metadata.fileSizes[fileID].bytes;
    const thumbnail_index = product.browses.findIndex((url) =>
      url.toLowerCase().includes('thumbnail'),
    );
    if (thumbnail_index !== -1) {
      product.thumbnail = product.browses.splice(thumbnail_index, 1)[0];
    }
    product.browses = product.browses.filter((url) => !url.includes('low-res'));

    const s3UrlsByProductID = product.metadata.s3Urls.reduce((prev, curr) => {
      const subproductFileID = curr.split('/').at(-1);

      prev[subproductFileID] = curr;

      return prev;
    }, {});

    product.metadata.s3URI = s3UrlsByProductID[product.file] ?? null;

    const browses = [];
    for (const p of [
      ...product.metadata.additionalUrls.filter(
        (url) => url !== product.downloadUrl,
      ),
      ...product.browses,
    ]) {
      file_extension = this.urlToProductType(
        p,
        models.seasat.productTypeDisplays,
      );

      const productTypeDisplay =
        models.seasat.productTypeDisplays[file_extension.toLowerCase()] ??
        'Missing Display';
      if (productTypeDisplay === 'Missing Display') {
        console.log(
          `Missing product type display for file extension "${file_extension}"`,
        );
      }

      if (['Metadata IN'].includes(productTypeDisplay)) {
        continue;
      }

      const fileID = p.split('/').slice(-1)[0];
      const s3Url = s3UrlsByProductID[fileID] ?? null;
      const fileSize = product.metadata.fileSizes[fileID]?.bytes ?? 0;
      const subproduct = this.createSubproductForScene(
        product,
        p,
        s3Url,
        file_extension,
        productTypeDisplay,
        fileSize,
        browses,
      );

      products.push(subproduct);
    }

    return products.sort((a, b) => {
      if (
        a.productTypeDisplay.includes('Metadata') ||
        a.productTypeDisplay.includes('QA')
      ) {
        return 1;
      } else if (
        b.productTypeDisplay.includes('Metadata') ||
        b.productTypeDisplay.includes('QA')
      ) {
        return -1;
      }

      return a.productTypeDisplay < b.productTypeDisplay ? -1 : 1;
    });
  }

  private createSubproductForScene(
    scene: models.CMRProduct,
    url: string,
    s3uri: string,
    fileExtension: string,
    productTypeDisplay: string | null,
    fileSize: number,
    browses: string[],
  ) {
    const fileID = url.split('/').slice(-1)[0];
    return {
      ...scene,
      downloadUrl: url,
      productTypeDisplay: productTypeDisplay || url,
      file: fileID,
      id: scene.id + '-' + fileExtension + '-' + productTypeDisplay,
      bytes: fileSize,
      browses,
      thumbnail: null,
      metadata: {
        ...scene.metadata,
        productType: scene.metadata.productType,
        parentID: scene.id,
        subproducts: [],
        s3URI: s3uri,
      },
      virtual: true,
    } as models.CMRProduct;
  }

  private nisarSubproductsFromScene(product: models.CMRProduct) {
    const products = [];
    let temp = product.downloadUrl.split('.');
    let file_extension = temp[temp.length - 1];
    const productLevel = product.file.split('_')[1];
    product.productTypeDisplay = `${productLevel} ${product.metadata.productType} HDF5`;
    if (product.productTypeDisplay === 'Missing Display') {
      if (file_extension.includes('vc')) {
        product.productTypeDisplay = file_extension.toUpperCase();
      } else {
        console.log(
          `Missing product type display for file extension "${file_extension}"`,
        );
      }
    }
    const thumbnail_index = product.browses.findIndex((url) =>
      url.toLowerCase().includes('thumbnail'),
    );
    if (thumbnail_index !== -1) {
      product.thumbnail = product.browses.splice(thumbnail_index, 1)[0];
    }
    product.browses = product.browses.filter((url) => !url.includes('low-res'));

    const s3UrlsByProductID = product.metadata.nisar.s3Urls.reduce(
      (prev, curr) => {
        const subproductFileID = curr.split('/').at(-1);

        prev[subproductFileID] = curr;

        return prev;
      },
      {},
    );

    product.metadata.s3URI = s3UrlsByProductID[product.file] ?? null;

    const browses = [];
    for (const p of [
      ...product.metadata.nisar.additionalUrls.filter(
        (url) => url !== product.downloadUrl,
      ),
      ...product.browses,
    ]) {
      temp = p.split('.');
      file_extension = temp[temp.length - 1];
      let productTypeDisplay =
        models.nisar.productTypeDisplays[file_extension.toLowerCase()] ??
        'Missing Display';
      if (productTypeDisplay === 'Missing Display') {
        if (file_extension.includes('vc')) {
          productTypeDisplay = file_extension.toUpperCase();
        } else {
          console.log(
            `Missing product type display for file extension "${file_extension}"`,
          );
        }
      }
      if (productTypeDisplay === 'Browse Image PNG') {
        if (p === '/assets/no-browse.png') {
          continue;
        }
      }
      if (p.endsWith('.h5') && p.includes('QA_')) {
        productTypeDisplay = models.nisar.productTypeDisplays.qa;
      }

      if (['Log File', 'Metadata JSON'].includes(productTypeDisplay)) {
        continue;
      }

      const fileID = p.split('/').slice(-1)[0];
      const s3Url = s3UrlsByProductID[fileID] ?? null;
      const fileSize = product.metadata.nisar?.sizeMB?.[fileID]?.bytes ?? 0;
      const subproduct = this.createSubproductForScene(
        product,
        p,
        s3Url,
        file_extension,
        productTypeDisplay,
        fileSize,
        browses,
      );

      products.push(subproduct);
    }

    return products.sort((a, b) => {
      if (
        a.productTypeDisplay.includes('Metadata') ||
        a.productTypeDisplay.includes('QA')
      ) {
        return 1;
      } else if (
        b.productTypeDisplay.includes('Metadata') ||
        b.productTypeDisplay.includes('QA')
      ) {
        return -1;
      }

      return a.productTypeDisplay < b.productTypeDisplay ? -1 : 1;
    });
  }
}
