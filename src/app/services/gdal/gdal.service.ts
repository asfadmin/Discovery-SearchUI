import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CMRProduct, NISARDatasetsByProduct, NISARDataset } from '@models';
import { MapService } from '@services';

export interface GdalOptionsWithFileType {
  datasetPath?: string;
  projection?: string;
  outputFormat: string;
  outputExtension: string;
  aoi?: boolean;
  minimalCommand?: boolean;
  os?: string;
}

export interface GdalOptionsWithoutFileType {
  datasetPath?: string;
  projection?: string;
  outputFormat?: never;
  outputExtension?: never;
  aoi?: boolean;
  minimalCommand?: boolean;
  os?: string;
}

export type GdalOptions = GdalOptionsWithFileType | GdalOptionsWithoutFileType;

@Injectable({
  providedIn: 'root',
})
export class GdalService {
  mapService = inject(MapService);
  searchPolygon = toSignal(this.mapService.searchPolygon$);
  public configOptions(os: string) {
    return [
      'CPL_VSIL_CURL_CHUNK_SIZE=2097152',
      'CPL_VSIL_CURL_CACHE_SIZE=67108864',
      'GDAL_CACHEMAX=64000000',
      'GDAL_DISABLE_READDIR_ON_OPEN=TRUE',
      'GDAL_HTTP_MERGE_CONSECUTIVE_RANGES=YES',
      'GDAL_HTTP_MULTIPLEX=YES',
      'GDAL_NUM_THREADS=ALL_CPUS',
      'CPL_VSIL_CURL_CACHE_SIZE=1GB',
      'GDAL_HTTP_NETRC=YES',
      `GDAL_HTTP_COOKIEFILE=${this.getTempDir(os)}gdal_cookies.txt`,
      `GDAL_HTTP_COOKIEJAR=${this.getTempDir(os)}gdal_cookies.txt`,
    ];
  }

  private getTempDir(os: string) {
    if (os == 'Windows') {
      return '%TEMP%/';
    }

    return '/tmp/';
  }

  private resolveGDALCommand(options: GdalOptions): string {
    const reproject = 'projection' in options && options.projection !== '';
    const spatialSubset = 'aoi' in options && options.aoi;

    if (spatialSubset || reproject) {
      return 'gdalwarp';
    }

    return 'gdal_translate';
  }

  public generateGDALTranslateArguments(
    product: CMRProduct,
    options: GdalOptions,
    qgisArgs = false,
  ): string[] {
    let command = this.resolveGDALCommand(options);
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

    if (command == 'gdalwarp') {
      optionalArgs.push('-dstalpha');
    }

    if (!minimalCommand) {
      configOptions.push(
        ...this.configOptions(options.os).map(
          (configOption) => `--config ${configOption}`,
        ),
      );
    }

    if (qgisArgs) {
      return [...optionalArgs, ...configOptions];
    }

    return [
      command,
      downloadURL,
      outputFileName,
      ...optionalArgs,
      ...configOptions,
    ];
  }

  public generateGdalrc(options: GdalOptions) {
    return this.configOptions(options.os).join('\n');
  }

  public generateGDALCommand(
    product: CMRProduct,
    options: GdalOptions,
  ): string {
    if (options.os && options.os == 'Windows') {
      return `${this.generateGDALTranslateArguments(product, options).join(' ^\n        ')}`;
    }

    return `${this.generateGDALTranslateArguments(product, options).join(' \\\n        ')}`;
  }

  public generateQGISScript(product: CMRProduct, options: GdalOptions): string {
    const extraArgs = this.generateGDALTranslateArguments(
      product,
      options,
      true,
    );

    //     if (options.os == 'Windows' || true) {
    //       const gdalFunction =
    //         this.resolveGDALCommand(options) === 'gdal_translate'
    //           ? 'gdal.Translate'
    //           : 'gdal.Warp';

    //       return `
    // from osgeo import gdal

    // input_raster = gdal.Open('HDF5:/vsicurl/"${product.downloadUrl}":${options.datasetPath}')
    // output_raster = '/tmp/${product.name}'
    // args_list = "${extraArgs.join(' ')}"
    // gdaloptions = ${gdalFunction}Options(options=args_list)

    // ${gdalFunction}(output_raster, input_raster, options=gdaloptions)

    // iface.addRasterLayer("/tmp/${product.name}", "${product.name}")
    // print("Done!")
    //       `;
    //     }

    const processingString =
      this.resolveGDALCommand(options) === 'gdal_translate'
        ? 'gdal:translate'
        : 'gdal:warpreproject';

    return `
import qgis.processing

input_raster = 'HDF5:/vsicurl/"${product.downloadUrl}":${options.datasetPath}'
output_raster = "TEMPORARY_OUTPUT"

parameters = {
    "INPUT": input_raster,
    "OUTPUT": output_raster,
    "EXTRA": "${extraArgs.join(' ')}",
}

result = processing.run("${processingString}", parameters)

iface.addRasterLayer(result["OUTPUT"], "${product.name}")
print("Done!")
    `;
  }

  public getProductDatasets(product: CMRProduct): NISARDataset[] {
    return NISARDatasetsByProduct(product);
  }

  public isCropToAOIAvailable(): boolean {
    if (this.searchPolygon() === null || this.searchPolygon() === undefined) {
      return false;
    }

    return this.searchPolygon().includes('POLYGON');
  }
}
