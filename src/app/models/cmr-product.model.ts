import * as moment from 'moment';

import { Hyp3Job } from './hyp3';

export type CMRProductPair = CMRProduct[];
export type CMRProductsById = Record<string, CMRProduct>;

export interface CMRProduct {
  name: string;
  productTypeDisplay: string;
  file: string;
  id: string;
  downloadUrl: string;
  bytes: number;
  browses: string[];
  thumbnail: string;
  dataset: string;
  groupId: string;
  isUnzippedFile: boolean;
  isDummyProduct: boolean;
  virtual?: boolean;

  metadata: CMRProductMetadata;
}

export interface CMRProductMetadata {
  date: moment.Moment;
  stopDate: moment.Moment;
  polygon: string;

  productType: string;
  beamMode: string;
  polarization: string;
  flightDirection: FlightDirection;

  path: number;
  frame: number;
  absoluteOrbit: number[];

  collectionName: string;
  collectionID: string;

  stackSize: number;
  // ALOS PALSAR
  faradayRotation: number | null;
  offNadirAngle: number | null;

  // AVNIR-2
  instrument: string | null;
  pointingAngle: string | null;

  // UAVSAR
  missionName: string | null;

  // AIRSAR
  flightLine: string | null;

  // Baseline
  perpendicular: number | null;
  temporal: number | null;
  canInSAR: boolean;

  // SLC BURST
  burst: SLCBurstMetadata | null;

  // OPERA-S1
  opera: OperaS1Metadata | null;
  nisar: NISARMetadata | null;

  fileName: string | null;
  job: Hyp3Job | null;

  // versioning
  pgeVersion: string | null;

  // BURST XML, OPERA-S1, NISAR
  subproducts: any[];
  additionalUrls?: string[] | null;
  s3URI?: string;
  s3Urls?: string[] | null;
  fileSizes?: Record<string, { bytes: number }> | null;
  parentID: string;

  // ARIA S1 GUNW
  ariaVersion: string | null;
}

export interface SLCBurstMetadata {
  relativeBurstID: number;
  absoluteBurstID: number;
  fullBurstID: string;
  burstIndex: number;
  azimuthTime: moment.Moment;
  azimuthAnxTime: string;
  samplesPerBurst: number;
  subswath: string;
}

export interface OperaS1Metadata {
  operaBurstID: string;
  additionalUrls: string[];
  s3Urls: string[];
  validityStartDate?: moment.Moment | null;
}

export interface NISARMetadata {
  additionalUrls: string[];
  s3Urls: string[];
  frameCoverage: string;
  jointObservation: string;
  sideBandPolarization: string;
  mainBandPolarization: string;
  rangeBandwidth: string;
  sizeMB?: Record<string, { bytes: number; format: string }>;
}

export enum FlightDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export enum JustDescending {
  DESCENDING = 'DESCENDING',
}

export enum ColumnSortDirection {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  NONE = 'NONE',
}
