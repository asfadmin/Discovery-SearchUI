import * as fromDatasets from './datasets';
import { Props } from './filters.model';

export interface Dataset {
  id: string;
  name: string;
  apiValue: {[paramName: string]: string};
  date: DateRange;
  infoUrl: string;
  citationUrl: string;
  productTypes: ProductType[];
  beamModes: string[];
  polarizations: string[];
  subtypes: DatasetSubtype[];
  frequency: string;
  source: {
    name: string;
    url: string | null;
  } | null;
  properties: Props[];
}

export enum MissionDataset {
  UAVSAR = 'UAVSAR',
  AIRSAR = 'AIRSAR',
  S1_BETA = 'Sentinel-1 Interferogram (BETA)',
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export interface ProductType {
  displayName: string;
  apiValue: string;
}

export interface DatasetSubtype {
  displayName: string;
  apiValue: string;
}

export type DatasetProductTypes = ProductType[];
export type DatasetBeamModes = string[];
export type DatasetPolarizations = string[];
export type DatasetSubtypes = DatasetSubtype[];

export const datasets: Dataset[] = [
  fromDatasets.sentinel_1,
  fromDatasets.beta,
  fromDatasets.smap,
  fromDatasets.uavsar,
  fromDatasets.alos,
  fromDatasets.radarsat_1,
  fromDatasets.ers,
  fromDatasets.jers_1,
  fromDatasets.airsar,
  fromDatasets.seasat,
];

export const flightDirections = [
  'Ascending',
  'Descending'
];
