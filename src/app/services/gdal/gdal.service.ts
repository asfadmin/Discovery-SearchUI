import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CMRProduct, NISARDatasetByProduct, NISARDataset } from '@models';
import { MapService } from '@services';

export interface GdalOptionsWithFileType {
  datasetPath?: string;
  projection?: string;
  outputFormat: string;
  outputExtension: string;
  aoi?: boolean;
  minimalCommand?: boolean;
}

export interface GdalOptionsWithoutFileType {
  datasetPath?: string;
  projection?: string;
  outputFormat?: never;
  outputExtension?: never;
  aoi?: boolean;
  minimalCommand?: boolean;
}

export type GdalOptions = GdalOptionsWithFileType | GdalOptionsWithoutFileType;

@Injectable({
  providedIn: 'root',
})
export class GdalService {
  mapService = inject(MapService);
  searchPolygon = toSignal(this.mapService.searchPolygon$);
  configOptions = [
    'CPL_VSIL_CURL_CHUNK_SIZE=2097152',
    'CPL_VSIL_CURL_CACHE_SIZE=67108864',
    'GDAL_CACHEMAX=64000000',
    'GDAL_DISABLE_READDIR_ON_OPEN=TRUE',
    'GDAL_HTTP_MERGE_CONSECUTIVE_RANGES=YES',
    'GDAL_HTTP_MULTIPLEX=YES',
    'GDAL_NUM_THREADS=ALL_CPUS',
    'CPL_VSIL_CURL_CACHE_SIZE=1GB',
    'GDAL_HTTP_NETRC=YES',
    'GDAL_HTTP_COOKIEFILE=/tmp/gdal_cookies.txt',
    'GDAL_HTTP_COOKIEJAR=/tmp/gdal_cookies.txt',
  ];

  public generateGDALTranslateArguments(
    product: CMRProduct,
    options: GdalOptions,
  ): string[] {
    let command = 'gdal_translate';
    const datasetPath = options.datasetPath ?? '<DATASET PATH>';
    const downloadURL = `HDF5:"/vsicurl/${product.downloadUrl}":${datasetPath}`;
    const outputFormat = options.outputFormat ?? 'GTiff';
    const outputExtension = options.outputExtension ?? '.tiff';
    const outputFileName = `-of ${outputFormat} ${product.name}${outputExtension}`;
    const configOptions = [];
    const optionalArgs = [];

    const reproject = 'projection' in options && options.projection !== '';
    const spatialSubset = 'aoi' in options && options.aoi;
    const minimalCommand =
      'minimalCommand' in options && options.minimalCommand;

    if (spatialSubset) {
      const cutlineArgs = [
        `-cutline ${this.searchPolygon()}`,
        `-cutline_srs WGS84`,
        `-crop_to_cutline`,
      ];
      optionalArgs.push(...cutlineArgs);
    }

    if (reproject) {
      const projection = `-t_srs ${options.projection}`;
      optionalArgs.push(projection);
    }

    if (spatialSubset || reproject) {
      command = 'gdalwarp';
      optionalArgs.push('-dstalpha');
    }

    if (!minimalCommand) {
      configOptions.push(
        ...this.configOptions.map((configOption) => `--config ${configOption}`),
      );
    }

    return [
      command,
      downloadURL,
      outputFileName,
      ...optionalArgs,
      ...configOptions,
    ];
  }

  public generateGdalrc() {
    return this.configOptions.join('\n');
  }

  public generateGDALCommand(
    product: CMRProduct,
    options: GdalOptions,
  ): string {
    return `${this.generateGDALTranslateArguments(product, options).join(' \\\n                          ')}`;
  }

  public getProductDatasets(product: CMRProduct): NISARDataset[] {
    return NISARDatasetByProduct[product.metadata.productType](product);
  }
}
