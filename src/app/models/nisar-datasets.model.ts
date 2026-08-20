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
            {
              path: '//science/LSAR/GCOV/grids/frequencyA/mask',
              name: 'Frequency A Mask',
              type: 'UByte',
            },
          ),
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
            {
              path: '//science/LSAR/GCOV/grids/frequencyB/mask',
              name: 'Frequency B Mask',
              type: 'UByte',
            },
          ),
        );
      }
      break;
    case 'GUNW':
      if (product.metadata.nisar.mainBandPolarization) {
        datasets.push(
          ...nisar.mainBandPolarization.map(
            (polarization: string): NISARDataset => {
              return {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/coherenceMagnitude`,
                name: `Frequency A ${polarization} Unwrapped Interferogram Coherence`,
                type: 'Float32',
              };
            },
          ),
          ...nisar.mainBandPolarization.map(
            (polarization: string): NISARDataset => {
              return {
                path: `//science/LSAR/GUNW/grids/frequencyA/unwrappedInterferogram/${polarization}/unwrappedPhase`,
                name: `Frequency A ${polarization} Unwrapped Phase`,
                type: 'Float32',
              };
            },
          ),
          ...nisar.mainBandPolarization.map(
            (polarization: string): NISARDataset => {
              return {
                path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/coherenceMagnitude`,
                name: `Frequency A ${polarization} Wrapped Interferogram Coherence`,
                type: 'Float32',
              };
            },
          ),
          ...nisar.mainBandPolarization.map(
            (polarization: string): NISARDataset => {
              return {
                path: `//science/LSAR/GUNW/grids/frequencyA/wrappedInterferogram/${polarization}/wrappedInterferogram`,
                name: `Frequency A ${polarization} Wrapped Interferogram`,
                type: 'Float32',
              };
            },
          ),
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
        );
      }
      break;
  }

  return datasets;
}

export interface NISARDataset {
  path: string;
  name?: string;
  description?: string;
  type?: string;
}
