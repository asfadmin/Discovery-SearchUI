import * as moment from 'moment';

import { Hyp3Job } from './hyp3.model';

export type CMRProductPair = CMRProduct[];

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

  fileName: string | null;
  job: Hyp3Job | null;
}

export interface SLCBurstMetadata {
  relativeBurstID: number;
  absoluteBurstID: number;
  fullBurstID: string;
  burstIndex: number;
  burstAnxTime: string;
  timeFromAnxSeconds: string;
  samplesPerBurst: number;
  subswath: string;
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
