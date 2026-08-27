import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CMRProduct, datasetsForGDALProduct, GDALDataset } from '@models';
import { MapService } from '@services';

export interface GdalOutputType {
  outputFormat: GdalFormats;
  outputExtension: string;
}

export interface GdalProductInfo {
  name: string;
  downloadUrl: string;
  productType: string;
  mainBandPolarization?: string[];
  sideBandPolarization?: string[];
}

export interface GdalOptions {
  product: GdalProductInfo;
  datasetPath: string;
  projection?: string;
  outputType?: GdalOutputType;
  aoi?: boolean;
  minimalCommand?: boolean;
  os?: GdalOs;
  outputFilename?: string;
  gdalVersion?: GdalVersion;
}

export const GDAL_COMMAND_PLACEHOLDER = `gdal_translate -of GTiff \\
                "/vsicurl/https://<DOWNLOAD URL>":<VARIABLE PATH> <OUTPUT FILE>.tif \\
                --config CPL_VSIL_CURL_CHUNK_SIZE 2097152 \\
                --config CPL_VSIL_CURL_CACHE_SIZE 67108864 \\
                --config GDAL_CACHEMAX 64000000 \\
                --config GDAL_DISABLE_READDIR_ON_OPEN=TRUE \\
                --config GDAL_HTTP_MERGE_CONSECUTIVE_RANGES=YES \\
                --config GDAL_HTTP_MULTIPLEX=YES \\
                --config GDAL_NUM_THREADS=ALL_CPUS \\
                --config CPL_VSIL_CURL_CACHE_SIZE=1GB \\
                --config GDAL_HTTP_NETRC=YES \\
                --config GDAL_HTTP_COOKIEFILE=/tmp/gdal_cookies.txt \\
                --config GDAL_HTTP_COOKIEJAR=/tmp/gdal_cookies.txt
`;

export const GDAL_VERSIONS = ['≥3.13', '<3.13'];
export type GdalVersion = (typeof GDAL_VERSIONS)[number];

export const GDAL_OS = ['Windows', 'Unix'];
export type GdalOs = (typeof GDAL_OS)[number];

export const GDAL_FORMATS = ['GTiff', 'COG'];
export type GdalFormats = (typeof GDAL_FORMATS)[number];

@Injectable({
  providedIn: 'root',
})
export class GdalService {
  mapService = inject(MapService);
  searchPolygon = toSignal(this.mapService.searchPolygon$);

  public cmrProductToGDALProductInfo(product: CMRProduct): GdalProductInfo {
    return {
      name: product.name,
      downloadUrl: product.downloadUrl,
      productType: product.metadata.productType,
      mainBandPolarization: product.metadata.nisar?.mainBandPolarization,
      sideBandPolarization: product.metadata.nisar?.sideBandPolarization,
    };
  }

  public configOptions(options: GdalOptions) {
    return [
      'CPL_VSIL_CURL_CHUNK_SIZE 2097152',
      'CPL_VSIL_CURL_CACHE_SIZE 67108864',
      'GDAL_CACHEMAX 64000000',
      'GDAL_DISABLE_READDIR_ON_OPEN TRUE',
      'GDAL_HTTP_MERGE_CONSECUTIVE_RANGES YES',
      'GDAL_HTTP_MULTIPLEX YES',
      'GDAL_NUM_THREADS ALL_CPUS',
      'CPL_VSIL_CURL_CACHE_SIZE 1GB',
      'GDAL_HTTP_NETRC YES',
      `GDAL_HTTP_COOKIEFILE ${this.getTempDir(options)}gdal_cookies.txt`,
      `GDAL_HTTP_COOKIEJAR ${this.getTempDir(options)}gdal_cookies.txt`,
    ];
  }

  private getTempDir(options: GdalOptions) {
    if (options.os == 'Windows') {
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

  public resolveOutputFormat(options: GdalOptions): string {
    return options.outputType?.outputFormat ?? 'GTiff';
  }

  public resolveOutputFilename(options: GdalOptions): string {
    if (options.outputFilename) {
      return options.outputFilename;
    }

    const outputExtension = options.outputType?.outputExtension ?? '.tif';
    return `${options.product.name}${options.datasetPath.replaceAll('\/', '_')}${outputExtension}`;
  }

  public resolveGDALVersion(options): string {
    return options.gdalVersion ?? '<3.13';
  }

  public generateGDALTranslateArguments(
    options: GdalOptions,
    qgisArgs = false,
  ): string[] {
    const command = this.resolveGDALCommand(options);
    const driver =
      this.resolveGDALVersion(options) == '>=3.13' ? 'HDF5' : 'NETCDF';
    const downloadURL = `${driver}:"/vsicurl/${options.product.downloadUrl}":${options.datasetPath}`;
    const outputFileName = `-of ${this.resolveOutputFormat(options)} "${this.resolveOutputFilename(options)}"`;
    const configOptions = [];
    const optionalArgs = [];

    const reproject = 'projection' in options && options.projection !== '';
    const spatialSubset = 'aoi' in options && options.aoi;
    const minimalCommand =
      'minimalCommand' in options && options.minimalCommand;

    if (spatialSubset) {
      const cutlineArgs = [
        `-cutline "${this.searchPolygon()}"`,
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
        ...this.configOptions(options).map(
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
    return this.configOptions(options).join('\n');
  }

  public generateGDALCommand(options: GdalOptions): string {
    return this.generateGDALTranslateArguments(options).join(
      ` ${options.os && options.os == 'Windows' ? '^' : '\\'}\r\n        `,
    );
  }

  public generateQGISScript(options: GdalOptions): string {
    const extraArgs = this.generateGDALTranslateArguments(options, true);

    const processingString =
      this.resolveGDALCommand(options) === 'gdal_translate'
        ? 'gdal:translate'
        : 'gdal:warpreproject';

    return `
import qgis.processing

input_raster = 'HDF5:/vsicurl/"${options.product.downloadUrl}":${options.datasetPath}'
output_raster = "TEMPORARY_OUTPUT"

parameters = {
    "INPUT": input_raster,
    "OUTPUT": output_raster,
    "EXTRA": "${extraArgs.join(' ')}",
}

result = processing.run("${processingString}", parameters)

iface.addRasterLayer(result["OUTPUT"], "${options.product.name}")
print("Done!")
    `;
  }

  public getProductDatasets(product: GdalProductInfo): GDALDataset[] {
    return datasetsForGDALProduct(product).sort((a, b) => {
      if (a.ancillary == b.ancillary) {
        return 0;
      }
      if (a.ancillary !== undefined && a.ancillary) {
        return 1;
      }

      return -1;
    });
  }

  public isCropToAOIAvailable(): boolean {
    return this.searchPolygon()?.includes('POLYGON') ?? false;
  }
}
