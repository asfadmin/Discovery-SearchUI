import { FiltersState } from '@store/filters';
import * as fromDatasets from './datasets';
import { Props } from './filters.model';

export interface Dataset {
  id: string;
  name: string;
  subName: string;
  beta: boolean;
  apiValue: Record<string, string>;
  date: DateRange;
  defaultFilters?: Partial<FiltersState>;
  infoUrl: string;
  citationUrl: string;
  productTypes: ProductType[];
  beamModes: string[];
  polarizations: string[];
  sidepolarizations?: string[];
  platforms: DatasetPlatform[];
  frequency: string;
  source: {
    name: string;
    url: string | null;
  } | null;
  properties: Props[];
  description: string;
  icon: string;
  collectionMap?: DatasetCollectionMap;

  calibrationDatasets?: string[];
  calibrationProductTypes?: ProductType[];
  shortNames?: ShortName[]; // For NISAR shortnames
  instruments?: { displayName: string; apiValue: string }[];
  bandwidth?: Record<string, string[]>;
  frameMap?: {
    ascending: string;
    descending: string;
  };
  productTypeDisplays?: Record<string, string>;
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

export interface ShortName {
  displayName: string;
  apiValue: string;
}

export interface DatasetPlatform {
  displayName: string;
  apiValue: string;
}

export type DatasetCollectionMap = Record<string, string>;

export type DatasetProductTypes = ProductType[];
export type DatasetShortName = ShortName[];
export type DatasetBeamModes = string[];
export type DatasetPolarizations = string[];
export type DatasetPlatforms = DatasetPlatform[];

export const sentinel_1 = fromDatasets.sentinel_1;
export const sentinel_1_bursts = fromDatasets.sentinel_1_bursts;
export const opera_s1 = fromDatasets.opera_s1;
export const alos = fromDatasets.alos;
export const alos_2 = fromDatasets.alos_2;
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
export const nisar = fromDatasets.nisar;
export const tropo = fromDatasets.tropo;

export const datasetList: Dataset[] = [
  fromDatasets.nisar,
  fromDatasets.sentinel_1,
  fromDatasets.sentinel_1_bursts,
  fromDatasets.opera_s1,
  fromDatasets.tropo,
  fromDatasets.alos_2,
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

export const datasetIds = datasetList.map((dataset) => dataset.id);

export const datasets: Record<string, Dataset> = datasetList.reduce(
  (datasetsObj, dataset) => {
    datasetsObj[dataset.id] = dataset;

    return datasetsObj;
  },
  {} as Record<string, Dataset>,
);

export const flightDirections = ['Ascending', 'Descending'];

export const justDescending = ['Descending'];
