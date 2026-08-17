import { Injectable } from '@angular/core';
import { CMRProduct, NISARDatasetByProduct, NISARDataset } from '@models';

@Injectable({
  providedIn: 'root',
})
export class GdalService {
  public generateGDALTranslateArguments(
    product: CMRProduct,
    datasetPath: string,
  ): string[] {
    const downloadURL = `HDF5:"/vsicurl/${product.downloadUrl}":${datasetPath}`;
    const outputFileName = `-of GTiff ${product.name}.h5`;
    const configOptions = [
      '--config CPL_VSIL_CURL_CHUNK_SIZE 2097152',
      '--config CPL_VSIL_CURL_CACHE_SIZE 67108864',
      '--config GDAL_CACHEMAX 64000000',
      '--config GDAL_DISABLE_READDIR_ON_OPEN=TRUE',
      '--config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES=YES',
      '--config GDAL_HTTP_MULTIPLEX=YES',
      '--config GDAL_NUM_THREADS=ALL_CPUS',
      '--config CPL_VSIL_CURL_CACHE_SIZE=1GB',
      '--config GDAL_HTTP_NETRC=YES',
      '--config GDAL_HTTP_COOKIEFILE=/tmp/gdal_cookies.txt',
      '--config GDAL_HTTP_COOKIEJAR=/tmp/gdal_cookies.txt',
    ];

    return [downloadURL, outputFileName, ...configOptions];
  }

  public generateGDALCommand(product: CMRProduct, datasetPath: string): string {
    return `gdal_translate ${this.generateGDALTranslateArguments(product, datasetPath).join(' \\\n')}`;
  }

  public getProductDatasets(product: CMRProduct): NISARDataset[] {
    return NISARDatasetByProduct[product.metadata.productType](product);
  }
}
