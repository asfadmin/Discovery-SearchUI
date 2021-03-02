import { Dataset } from './dataset.model';

export interface Hyp3JobType {
  id: string;
  name: string;
  numProducts: number;
  productTypes: Hyp3JobProductType[];
}

export interface Hyp3JobProductType {
  dataset: Dataset;
  productTypes: string[];
  beamModes: string[];
  polarizations: string[];
}

