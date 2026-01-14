import { Injectable } from '@angular/core';
import * as models from '@models';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root',
})
export class SubproductService {
  public getSubproducts(product: models.CMRProduct): models.CMRProduct[] {
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

        if (!productTypeDisplay.hasOwnProperty(file_type?.toLowerCase())) {
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

  private fromCMRDate = (dateString: string): moment.Moment => {
    return moment.utc(dateString);
  };
  private operaSubproductsFromScene(product: models.CMRProduct) {
    product.metadata.s3URI = product.metadata.opera.s3Urls[0];
    if (product.metadata.opera?.validityStartDate) {
      product.metadata.opera.validityStartDate = this.fromCMRDate(
        product.metadata.opera?.validityStartDate as unknown as string,
      );
    }
    const products = [];

    let file_suffix = '';

    if (['DISP-S1', 'TROPO-ZENITH'].includes(product.metadata.productType)) {
      file_suffix = 'nc';
    } else {
      file_suffix = this.urlToProductType(
        product.downloadUrl,
        models.opera_s1.productTypeDisplays,
      );
    }

    product.productTypeDisplay =
      models.opera_s1.productTypeDisplays[file_suffix?.toLowerCase()] ??
      'Download';

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

      return a.productTypeDisplay < b.productTypeDisplay ? -1 : 1;
    });
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
      id: scene.id + '-' + fileExtension,
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
