import * as fromDatasets from './datasets';
import { Props } from './filters.model';

export interface Dataset {
  id: string;
  name: string;
  subName: string;
  beta: boolean;
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
  platformDesc: string;
  platformIcon: string;

  calibrationDatasets?: string[];
  calibrationProductTypes?: ProductType[];
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

export const sentinel_1 = fromDatasets.sentinel_1;
export const sentinel_1_bursts = fromDatasets.sentinel_1_bursts;
export const opera_s1 = fromDatasets.opera_s1;
export const alos = fromDatasets.alos;
export const avnir = fromDatasets.avnir;
export const sirc = fromDatasets.sirc;
export const beta = fromDatasets.beta;
export const smap = fromDatasets.smap;
export const uavsar = fromDatasets.uavsar;
export const radarsat_1 = fromDatasets.radarsat_1;
export const ers = fromDatasets.ers;
export const jers_1 = fromDatasets.jers_1;
export const airsar = fromDatasets.airsar;
export const seasat = fromDatasets.seasat;

export const datasetList: Dataset[] = [
  fromDatasets.sentinel_1,
  fromDatasets.sentinel_1_bursts,
  fromDatasets.opera_s1,
  fromDatasets.alos,
  fromDatasets.avnir,
  fromDatasets.sirc,
  fromDatasets.beta,
  fromDatasets.smap,
  fromDatasets.uavsar,
  fromDatasets.radarsat_1,
  fromDatasets.ers,
  fromDatasets.jers_1,
  fromDatasets.airsar,
  fromDatasets.seasat,
];

export const datasetIds = datasetList.map(dataset => dataset.id);

export const datasets: {[datasetID: string]: Dataset} = datasetList.reduce(
  (datasetsObj, dataset) => {
    datasetsObj[dataset.id] = dataset;

    return datasetsObj;
  },
  {} as {[datasetID: string]: Dataset}
);

export const flightDirections = [
  'Ascending',
  'Descending'
];

export const justDescending = [
  'Descending'
];
