import { GdalProductInfo } from '@services/gdal/gdal.service';

export function datasetsForGDALProduct(
  product: GdalProductInfo,
): GDALDataset[] {
  const datasets = [];
  switch (product.productType) {
    case 'GCOV': {
      if (product.mainBandPolarization) {
        if (
          ['HH', 'HV', 'VH', 'VV'].every((polarization) =>
            product.mainBandPolarization.includes(polarization),
          )
        ) {
          datasets.push(
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/HHHV`,
              name: `Frequency A HHHV Covariance`,
              type: 'Float32',
            },
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/HHVH`,
              name: `Frequency A HHVH Covariance`,
              type: 'Float32',
            },
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/HHVV`,
              name: `Frequency A HHVV Covariance`,
              type: 'Float32',
            },
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/HVVH`,
              name: `Frequency A HVVH Covariance`,
              type: 'Float32',
            },
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/HVVV`,
              name: `Frequency A HVVV Covariance`,
              type: 'Float32',
            },
            {
              path: `//science/LSAR/GCOV/grids/frequencyA/VHVV`,
              name: `Frequency A VHVV Covariance`,
              type: 'Float32',
            },
          );
        }

        datasets.push(
          ...product.mainBandPolarization.map(
            (polarization: string): GDALDataset => {
              return {
                path: `//science/LSAR/GCOV/grids/frequencyA/${polarization}${polarization}`,
                name: `Frequency A ${polarization}${polarization} Covariance`,
                type: 'Float32',
              };
            },
          ),
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/numberOfLooks',
            name: 'Frequency A Number of Looks',
            type: 'Float32',
            ancillary: true,
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/rtcGammaToSigmaFactor',
            name: 'Frequency A RTC Gamma To Sigma Factor',
            type: 'Float32',
            ancillary: true,
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/mask',
            name: 'Frequency A Mask',
            type: 'UByte',
          },
        );
      }
      if (product.sideBandPolarization) {
        datasets.push(
          ...product.sideBandPolarization.map(
            (polarization: string): GDALDataset => {
              return {
                path: `//science/LSAR/GCOV/grids/frequencyB/${polarization}${polarization}`,
                name: `Frequency B ${polarization}${polarization} Covariance`,
                type: 'Float32',
              };
            },
          ),
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/numberOfLooks',
            name: 'Frequency B Number of Looks',
            type: 'Float32',
            ancillary: true,
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/rtcGammaToSigmaFactor',
            name: 'Frequency B RTC Gamma To Sigma Factor',
            type: 'Float32',
            ancillary: true,
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyB/mask',
            name: 'Frequency B Mask',
            type: 'UByte',
          },
        );
      }
      break;
    }
    case 'GUNW': {
      if (product.mainBandPolarization) {
        datasets.push(
          ...product.mainBandPolarization
            .map((polarization) => {
              return [
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/unwrappedPhase`,
                  name: `Frequency A ${polarization} Unwrapped Phase`,
                  type: 'Float32',
                  unit: 'Radians',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/coherenceMagnitude`,
                  name: `Frequency A ${polarization} Unwrapped Coherence Magnitude`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/wrappedInterferogram`,
                  name: `Frequency A ${polarization} Wrapped Interferogram`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/coherenceMagnitude`,
                  name: `Frequency A ${polarization} Wrapped Coherence`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/connectedComponents`,
                  name: `Frequency A ${polarization} Unwrapped Connected Components`,
                  type: 'UInt16',
                  ancillary: true,
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreen`,
                  name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen`,
                  type: 'Float32',
                  ancillary: true,
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreenUncertainty`,
                  name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen Uncertainty`,
                  type: 'Float32',
                  ancillary: true,
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/alongTrackOffset`,
                  name: `Frequency A ${polarization} Along Track Pixel Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                  ancillary: true,
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/slantRangeOffset`,
                  name: `Frequency A ${polarization} Slant Range Pixel Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                  ancillary: true,
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/correlationSurfacePeak`,
                  name: `Frequency A ${polarization} Correlation Surface Peak`,
                  type: 'Float32',
                  ancillary: true,
                },
              ];
            })
            .flat(Infinity),
          {
            path: '//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/mask',
            name: 'Frequency A Unwrapped Interferogram Mask',
            type: 'UByte',
          },
          {
            path: '//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/mask',
            name: 'Frequency A Wrapped Interferogram Mask',
            type: 'UByte',
          },
          {
            path: '//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/mask',
            name: 'Frequency A Pixel Offset Mask',
            type: 'UByte',
            ancillary: true,
          },
        );
      }
      break;
    }
    case 'SME2': {
      datasets.push(
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
      );
      if (product.mainBandPolarization) {
        datasets.push(
          ...product.mainBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/SME2/grids/radarData/frequencyA/sigma0${polarization}`,
              name: `Frequency A ${polarization} Sigma0`,
              type: 'Float32',
              ancillary: true,
            };
          }),
        );
      }
      if (product.sideBandPolarization) {
        datasets.push(
          ...product.sideBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/SME2/grids/radarData/frequencyB/sigma0${polarization}`,
              name: `Frequency B ${polarization} Sigma0`,
              type: 'Float32',
              ancillary: true,
            };
          }),
        );
      }
      break;
    }
    case 'GOFF': {
      if (product.mainBandPolarization) {
        datasets.push(
          ...product.mainBandPolarization
            .map((polarization) =>
              [
                { path: 'layer1', display: 'Layer 1' },
                { path: 'layer2', display: 'Layer 2' },
                { path: 'layer3', display: 'Layer 3' },
              ].map((layer) => {
                return [
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/alongTrackOffset`,
                    name: `Frequency A ${polarization} ${layer.display} Along Track Offset`,
                    type: 'Float32',
                    unit: 'Meters',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffset`,
                    name: `Frequency A ${polarization} ${layer.display} Slant Range Offset`,
                    type: 'Float32',
                    unit: 'Meters',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/alongTrackOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Along Track Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Slant Range Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/correlationSurfacePeak`,
                    name: `Frequency A ${polarization} ${layer.display} Correlation Surface Peak`,
                    type: 'Float32',
                    ancillary: true,
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/crossOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Cross Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                    ancillary: true,
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/snr`,
                    name: `Frequency A ${polarization} ${layer.display} Signal To Noise Ratio`,
                    type: 'Float32',
                    ancillary: true,
                  },
                ];
              }),
            )
            .flat(Infinity),
        );
      }
      break;
    }
    case 'GSLC': {
      if (product.mainBandPolarization) {
        datasets.push(
          ...product.mainBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/GSLC/grids/frequencyA/${polarization}`,
              name: `Frequency A ${polarization} Focused SLC Image`,
              type: 'CFloat32',
            };
          }),
          {
            path: `//science/LSAR/GSLC/grids/frequencyA/mask`,
            name: 'Frequency A Mask',
            type: 'UByte',
          },
        );
      }
      if (product.sideBandPolarization) {
        datasets.push(
          ...product.sideBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/GSLC/grids/frequencyB/${polarization}`,
              name: `Frequency B ${polarization} Focused SLC Image`,
              type: 'CFloat32',
            };
          }),
          {
            path: `//science/LSAR/GSLC/grids/frequencyA/mask`,
            name: 'Frequency B Mask',
            type: 'UByte',
          },
        );
      }
      break;
    }
  }

  return datasets;
}

export interface GDALDataset {
  path: string;
  name: string;
  type?: string;
  unit?: string;
  ancillary?: boolean;
}
