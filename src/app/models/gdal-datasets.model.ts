import { GdalProductInfo } from '@services/gdal/gdal.service';

export function datasetsForGDALProduct(product: GdalProductInfo): GDALCategory {
  const datasets: GDALCategory = new GDALCategory();
  const frequencies: { string: string; polarizations: string[] }[] = [];
  if (product.mainBandPolarization) {
    frequencies.push({
      string: 'A',
      polarizations: product.mainBandPolarization,
    });
  }

  if (product.sideBandPolarization) {
    frequencies.push({
      string: 'B',
      polarizations: product.sideBandPolarization,
    });
  }

  switch (product.productType) {
    case 'GCOV': {
      datasets.pushEmpty('GCOV');
      for (const frequency of frequencies) {
        const frequency_string = `FREQUENCY_${frequency.string}`;
        datasets.get('GCOV').pushEmpty(frequency_string);

        if (
          ['HH', 'HV', 'VH', 'VV'].every((polarization) =>
            frequency.polarizations.includes(polarization),
          )
        ) {
          datasets
            .get('GCOV')
            .get(frequency_string)
            .pushCategory('COVARIANCE', [
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/HHHV`,
                name: `Frequency ${frequency.string} HHHV Covariance`,
                type: 'Float32',
                polarization: 'HHHV',
              },
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/HHVH`,
                name: `Frequency ${frequency.string} HHVH Covariance`,
                type: 'Float32',
                polarization: 'HHVH',
              },
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/HHVV`,
                name: `Frequency ${frequency.string} HHVV Covariance`,
                type: 'Float32',
                polarization: 'HHVV',
              },
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/HVVH`,
                name: `Frequency ${frequency.string} HVVH Covariance`,
                type: 'Float32',
                polarization: 'HVVH',
              },
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/HVVV`,
                name: `Frequency ${frequency.string} HVVV Covariance`,
                type: 'Float32',
                polarization: 'HVVV',
              },
              {
                path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/VHVV`,
                name: `Frequency ${frequency.string} VHVV Covariance`,
                type: 'Float32',
                polarization: 'VHVV',
              },
            ]);
        }

        datasets
          .get('GCOV')
          .get(frequency_string)
          .pushCategory('COVARIANCE', [
            ...frequency.polarizations.map(
              (polarization: string): GDALDataset => {
                return {
                  path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/${polarization}${polarization}`,
                  name: `Frequency ${frequency.string} ${polarization}${polarization} Covariance`,
                  type: 'Float32',
                  polarization: `${polarization}${polarization}`,
                };
              },
            ),
          ]);

        datasets
          .get('GCOV')
          .get(frequency_string)
          .pushCategory('ANCILLARY', [
            {
              path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/numberOfLooks`,
              name: `Frequency ${frequency.string} Number of Looks`,
              type: 'Float32',
              ancillary: true,
            },
            {
              path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/rtcGammaToSigmaFactor`,
              name: `Frequency ${frequency.string} RTC Gamma To Sigma Factor`,
              type: 'Float32',
              ancillary: true,
            },
            {
              path: `//science/LSAR/GCOV/grids/frequency${frequency.string}/mask`,
              name: `Frequency ${frequency.string} Mask`,
              type: 'UByte',
            },
          ]);
      }
      break;
    }
    case 'GUNW': {
      datasets.pushEmpty('GUNW');
      if (product.mainBandPolarization) {
        datasets.get('GUNW').pushEmpty('FREQUENCY_A');
        for (const polarization of product.mainBandPolarization) {
          datasets
            .get('GUNW')
            .get('FREQUENCY_A')
            .pushCategory('UNWRAPPED', [
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/unwrappedPhase`,
                name: `Frequency A ${polarization} Unwrapped Phase`,
                type: 'Float32',
                unit: 'Radians',
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/coherenceMagnitude`,
                name: `Frequency A ${polarization} Unwrapped Coherence Magnitude`,
                type: 'Float32',
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/connectedComponents`,
                name: `Frequency A ${polarization} Unwrapped Connected Components`,
                type: 'UInt16',
                ancillary: true,
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreen`,
                name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen`,
                type: 'Float32',
                ancillary: true,
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreenUncertainty`,
                name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen Uncertainty`,
                type: 'Float32',
                ancillary: true,
                polarization: polarization,
              },
            ]);
          datasets
            .get('GUNW')
            .get('FREQUENCY_A')
            .pushCategory('WRAPPED', [
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/wrappedInterferogram`,
                name: `Frequency A ${polarization} Wrapped Interferogram`,
                type: 'Float32',
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/coherenceMagnitude`,
                name: `Frequency A ${polarization} Wrapped Coherence`,
                type: 'Float32',
                polarization: polarization,
              },
            ]);
          datasets
            .get('GUNW')
            .get('FREQUENCY_A')
            .pushCategory('ANCILLARY', [
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/alongTrackOffset`,
                name: `Frequency A ${polarization} Along Track Pixel Offset`,
                type: 'Float32',
                unit: 'Meters',
                ancillary: true,
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/slantRangeOffset`,
                name: `Frequency A ${polarization} Slant Range Pixel Offset`,
                type: 'Float32',
                unit: 'Meters',
                ancillary: true,
                polarization: polarization,
              },
              {
                path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/correlationSurfacePeak`,
                name: `Frequency A ${polarization} Correlation Surface Peak`,
                type: 'Float32',
                ancillary: true,
                polarization: polarization,
              },
            ]);
        }
        datasets
          .get('GUNW')
          .get('FREQUENCY_A')
          .pushCategory('UNWRAPPED', [
            {
              path: '//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/mask',
              name: 'Frequency A Unwrapped Interferogram Mask',
              type: 'UByte',
            },
          ]);

        datasets
          .get('GUNW')
          .get('FREQUENCY_A')
          .pushCategory('WRAPPED', [
            {
              path: '//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/mask',
              name: 'Frequency A Wrapped Interferogram Mask',
              type: 'UByte',
            },
          ]);

        datasets
          .get('GUNW')
          .get('FREQUENCY_A')
          .pushCategory('ANCILLARY', [
            {
              path: '//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/mask',
              name: 'Frequency A Pixel Offset Mask',
              type: 'UByte',
              ancillary: true,
            },
          ]);
      }
      break;
    }
    case 'SME2': {
      datasets.pushEmpty('SME2');
      datasets.get('SME2').pushCategory('SOIL_MOISTURE', [
        {
          path: '//science/LSAR/SME2/grids/soilMoisture',
          name: 'Soil Moisture',
          type: 'Float32',
          unit: 'Meters³/Meters³',
        },
        {
          path: '//science/LSAR/SME2/grids/soilMoistureUncertainty',
          name: 'Soil Moisture Uncertainty',
          type: 'Float32',
          unit: 'Meters³/Meters³',
        },
      ]);
      datasets.get('SME2').pushCategory('ANCILLARY', [
        {
          path: '//science/LSAR/SME2/grids/retrievalQualityFlag',
          name: 'Retrieval Quality Flag',
          type: 'UInt16',
          ancillary: true,
        },
        {
          path: '//science/LSAR/SME2/grids/surfaceQualityFlag',
          name: 'Surface Quality Flag',
          type: 'Int16',
          ancillary: true,
        },
        {
          path: '//science/LSAR/SME2/grids/ancillaryData/localIncidentAngle',
          name: 'Local Incident Angle',
          type: 'Float32',
          unit: 'Degrees',
          ancillary: true,
        },
      ]);
      for (const frequency of frequencies) {
        const frequency_string = `FREQUENCY_${frequency.string}`;
        datasets.get('SME2').get('ANCILLARY').pushEmpty(frequency_string);
        datasets
          .get('SME2')
          .get('ANCILLARY')
          .get(frequency_string)
          .pushCategory(
            'SIGMA_NOUGHT',
            frequency.polarizations.map((polarization) => {
              return {
                path: `//science/LSAR/SME2/grids/radarData/frequency${frequency.string}/sigma0${polarization}`,
                name: `Frequency ${frequency.string} ${polarization} Sigma0`,
                type: 'Float32',
                ancillary: true,
                polarization: polarization,
              };
            }),
          );
      }
      break;
    }
    case 'GOFF': {
      datasets.pushEmpty('GOFF');
      if (product.mainBandPolarization) {
        datasets.get('GOFF').pushEmpty('FREQUENCY_A');
        const layers = [
          { path: 'layer1', display: 'Layer 1' },
          { path: 'layer2', display: 'Layer 2' },
          { path: 'layer3', display: 'Layer 3' },
        ];
        for (const layer of layers) {
          for (const polarization of product.mainBandPolarization) {
            datasets
              .get('GOFF')
              .get('FREQUENCY_A')
              .pushCategory('OFFSET', [
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/alongTrackOffset`,
                  name: `Frequency A ${polarization} ${layer.display} Along Track Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                  polarization: polarization,
                },
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffset`,
                  name: `Frequency A ${polarization} ${layer.display} Slant Range Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                  polarization: polarization,
                },
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/alongTrackOffsetVariance`,
                  name: `Frequency A ${polarization} ${layer.display} Along Track Offset Variance`,
                  type: 'Float32',
                  unit: 'Meters²',
                  polarization: polarization,
                },
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffsetVariance`,
                  name: `Frequency A ${polarization} ${layer.display} Slant Range Offset Variance`,
                  type: 'Float32',
                  unit: 'Meters²',
                  polarization: polarization,
                },
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/crossOffsetVariance`,
                  name: `Frequency A ${polarization} ${layer.display} Cross Offset Variance`,
                  type: 'Float32',
                  unit: 'Meters²',
                  ancillary: true,
                  polarization: polarization,
                },
              ]);
            datasets
              .get('GOFF')
              .get('FREQUENCY_A')
              .pushCategory('ANCILLARY', [
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/correlationSurfacePeak`,
                  name: `Frequency A ${polarization} ${layer.display} Correlation Surface Peak`,
                  type: 'Float32',
                  ancillary: true,
                  polarization: polarization,
                },
                {
                  path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/snr`,
                  name: `Frequency A ${polarization} ${layer.display} Signal To Noise Ratio`,
                  type: 'Float32',
                  ancillary: true,
                  polarization: polarization,
                },
              ]);
          }
        }
      }
      break;
    }
    case 'GSLC': {
      datasets.pushEmpty('GSLC');

      for (const frequency of frequencies) {
        const frequency_string = `FREQUENCY_${frequency.string}`;
        datasets.get('GSLC').pushEmpty(frequency_string);
        datasets
          .get('GSLC')
          .get(frequency_string)
          .pushCategory('SINGLE_LOOK_COMPLEX', [
            ...frequency.polarizations.map((polarization) => {
              return {
                path: `//science/LSAR/GSLC/grids/frequency${frequency.string}/${polarization}`,
                name: `Frequency ${frequency.string} ${polarization} Focused SLC Image`,
                type: 'CFloat32',
              };
            }),
          ]);
        datasets.get('GSLC').pushCategory(frequency_string, [
          {
            path: `//science/LSAR/GSLC/grids/frequency${frequency.string}/mask`,
            name: `Frequency ${frequency.string} Mask`,
            type: 'UByte',
          },
        ]);
      }
      break;
    }
  }

  return Object.entries(datasets.categories)[0][1];
}

export class GDALCategory {
  public categories: Record<string, GDALCategory>;
  public datasets: GDALDataset[];
  public name: string;

  public constructor(name: string = null) {
    this.categories = {};
    this.datasets = [];
    this.name = name;
  }

  public get(index: string): GDALCategory {
    return this.categories[index];
  }

  public pushCategory(key: string, items: GDALDataset[]) {
    if (!(key in this.categories)) {
      this.pushEmpty(key);
    }

    this.categories[key].datasets.push(...items);
    return;
  }

  public pushEmpty(key: string) {
    this.categories[key] = new GDALCategory(key);
  }

  public isNonEmpty() {
    return (
      Object.keys(this.categories).length !== 0 || this.datasets.length !== 0
    );
  }

  public flatten(): GDALDataset[] {
    if (Object.keys(this.categories).length === 0) {
      return this.datasets;
    }

    const datasets = this.datasets;
    for (const [_, category] of Object.entries(this.categories)) {
      datasets.push(...category.flatten());
    }

    return datasets;
  }
}

export interface GDALDataset {
  path: string;
  name: string;
  type?: string;
  unit?: string;
  ancillary?: boolean;
  polarization?: string;
}
