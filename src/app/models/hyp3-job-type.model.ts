import { Dataset } from './dataset.model';

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
