import { Dataset } from './dataset.model';
import { CMRProduct } from './cmr-product.model';

export interface Hyp3JobType {
  id: string;
  name: string;
  numProducts: number;
  productTypes: Hyp3JobProductType[];
  options: Hyp3JobOption[];
}

export interface Hyp3JobProductType {
  dataset: Dataset;
  productTypes: string[];
  beamModes: string[];
  polarizations: string[];
}

export interface Hyp3JobOption {
  name: string;
  apiName: string;
  type: JobOptionType;
  info: string;
  options?: string[];
}

export enum JobOptionType {
  DROPDOWN = 'DROPDOWN',
  TOGGLE = 'TOGGLE'
}

export const isHyp3able = (products: CMRProduct[], jobType: Hyp3JobType): boolean => {
  return (
    products.length === jobType.numProducts &&
    jobType.productTypes.some(productType => {
      const types = new Set(productType.productTypes);
      const pols = new Set(productType.polarizations);
      const beamModes = new Set(productType.beamModes);

      return products.every(product =>
        types.has(product.metadata.productType) &&
        pols.has(product.metadata.polarization) &&
        beamModes.has(product.metadata.beamMode)
      );
    })
  );
};
