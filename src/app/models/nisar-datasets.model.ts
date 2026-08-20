import { CMRProduct } from '@models';

export function NISARDatasetsByProduct(product: CMRProduct): NISARDataset[] {
  if (!('nisar' in product.metadata)) {
    return [];
  }

  const nisar = product.metadata.nisar;

  const datasets = [];
  switch (product.metadata.productType) {
    case 'GCOV':
      if (product.metadata.nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization.map(
            (polarization: string): NISARDataset => {
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
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/rtcGammaToSigmaFactor',
            name: 'Frequency A RTC Gamma To Sigma Factor',
            type: 'Float32',
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/mask',
            name: 'Frequency A Mask',
            type: 'UByte',
          },
        );
      }
      if (product.metadata.nisar.sideBandPolarization) {
        datasets.push(
          ...nisar.sideBandPolarization.map(
            (polarization: string): NISARDataset => {
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
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyA/rtcGammaToSigmaFactor',
            name: 'Frequency B RTC Gamma To Sigma Factor',
            type: 'Float32',
          },
          {
            path: '//science/LSAR/GCOV/grids/frequencyB/mask',
            name: 'Frequency B Mask',
            type: 'UByte',
          },
        );
      }
      break;
    case 'GUNW':
      if (product.metadata.nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization
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
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/connectedComponents`,
                  name: `Frequency A ${polarization} Unwrapped Connected Components`,
                  type: 'UInt16',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreen`,
                  name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/ionospherePhaseScreenUncertainty`,
                  name: `Frequency A ${polarization} Unwrapped Ionosphere Phase Screen Uncertainty`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/coherenceMagnitude`,
                  name: `Frequency A ${polarization} Wrapped Coherence`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/wrappedInterferogram`,
                  name: `Frequency A ${polarization} Wrapped Interferogram`,
                  type: 'Float32',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/alongTrackOffset`,
                  name: `Frequency A ${polarization} Along Track Pixel Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                },
                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/slantRangeOffset`,
                  name: `Frequency A ${polarization} Slant Range Pixel Offset`,
                  type: 'Float32',
                  unit: 'Meters',
                },

                {
                  path: `//science/LSAR/GUNW/grids/frequencyA/pixelOffsets/${polarization}/correlationSurfacePeak`,
                  name: `Frequency A ${polarization} Correlation Surface Peak`,
                  type: 'Float32',
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
          },
        );
      }
      break;
    case 'SME2':
      datasets.push(
        {
          path: '//science/LSAR/SME2/grids/soilMoisture',
          name: 'Soil Moisture Estimate',
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
          path: '//science/LSAR/SME2/grids/ancillaryData/localIncidentAngle',
          name: 'Local Incident Angle',
          type: 'Float32',
          unit: 'Degrees',
        },
        {
          path: '//science/LSAR/SME2/grids/retrievalQualityFlag',
          name: 'Retrieval Quality Flag',
          type: 'UInt16',
        },
        {
          path: '//science/LSAR/SME2/grids/surfaceQualityFlag',
          name: 'Surface Quality Flag',
          type: 'Int16',
        },
      );
      if (nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/SME2/grids/radarData/frequencyA/sigma0${polarization}`,
              name: `Frequency A ${polarization} Sigma0`,
              type: 'Float32',
            };
          }),
        );
      }
      if (nisar.sideBandPolarization) {
        datasets.push(
          ...nisar.sideBandPolarization.map((polarization) => {
            return {
              path: `//science/LSAR/SME2/grids/radarData/frequencyB/sigma0${polarization}`,
              name: `Frequency B ${polarization} Sigma0`,
              type: 'Float32',
            };
          }),
        );
      }
      break;
    case 'GOFF':
      if (nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization
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
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/alongTrackOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Along Track Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/correlationSurfacePeak`,
                    name: `Frequency A ${polarization} ${layer.display} Correlation Surface Peak`,
                    type: 'Float32',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/crossOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Cross Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffset`,
                    name: `Frequency A ${polarization} ${layer.display} Slant Range Offset`,
                    type: 'Float32',
                    unit: 'Meters',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/slantRangeOffsetVariance`,
                    name: `Frequency A ${polarization} ${layer.display} Slant Range Offset Variance`,
                    type: 'Float32',
                    unit: 'Meters²',
                  },
                  {
                    path: `//science/LSAR/GOFF/grids/frequencyA/pixelOffsets/${polarization}/${layer.path}/snr`,
                    name: `Frequency A ${polarization} ${layer.display} Signal To Noise Ratio`,
                    type: 'Float32',
                  },
                ];
              }),
            )
            .flat(Infinity),
        );
      }
      break;
    case 'GSLC':
      if (nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization.map((polarization) => {
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
      if (nisar.sideBandPolarization) {
        datasets.push(
          ...nisar.sideBandPolarization.map((polarization) => {
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

  return datasets;
}

export interface NISARDataset {
  path: string;
  name: string;
  type?: string;
  unit?: string;
}
