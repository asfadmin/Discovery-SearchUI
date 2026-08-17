import { CMRProduct } from '@models';

export const NISARDatasetByProduct: Record<
  string,
  (products: CMRProduct) => NISARDataset[]
> = {
  GCOV: (product) => [
    ...product.metadata.nisar.mainBandPolarization.map(
      (polarization: string): NISARDataset => {
        return {
          // For now we just assume that the transmit polarization is the same as the receive. TODO fix
          path: `//science/LSAR/GCOV/grids/frequencyA/${polarization}${polarization}`,
          name: `Frequency A ${polarization}${polarization}`,
          type: 'Float32',
        };
      },
    ),
    {
      path: '//science/LSAR/GCOV/grids/frequencyA/mask',
      name: 'Frequency A Mask',
      type: 'UByte',
    },
    ...product.metadata.nisar.sideBandPolarization.map(
      (polarization: string): NISARDataset => {
        return {
          path: `//science/LSAR/GCOV/grids/frequencyB/${polarization}${polarization}`,
          name: `Frequency B ${polarization}${polarization}`,
          type: 'Float32',
        };
      },
    ),
    {
      path: '//science/LSAR/GCOV/grids/frequencyB/mask',
      name: 'Frequency B Mask',
      type: 'UByte',
    },
  ],
};

export interface NISARDataset {
  path: string;
  name?: string;
  description?: string;
  type?: string;
}
