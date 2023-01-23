import { Dataset } from './dataset.model';
import { CMRProduct } from './cmr-product.model';

export interface Hyp3JobType {
  id: string;
  name: string;
  infoUrl: string;
  description: string;
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
  default: any;
  options?: { apiValue: string | number; name: string; }[];
  optionSubset?: { apiName: string; value: any; }[];
}

export interface Hyp3ableProductByJobType {
  jobType: Hyp3JobType;
  byProductType: Hyp3ableByProductType[];
  total: number;
}

export interface Hyp3ableByProductType {
  productType: string;
  products: CMRProduct[][];
}

export enum JobOptionType {
  DROPDOWN = 'DROPDOWN',
  TOGGLE = 'TOGGLE',
  CHECKBOX = 'CHECKBOX',
  SUBSET = 'SUBSET',
}
