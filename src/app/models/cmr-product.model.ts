import * as moment from 'moment';

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
  polygon: string;

  productType: string;
  beamMode: string;
  polarization: string;
  flightDirection: FlightDirection;

  path: number;
  frame: number;
  absoluteOrbit: number;

  stackSize: number;
  // ALOS PALSAR
  faradayRotation: number | null;
  offNadirAngle: number | null;

  // UAVSAR
  missionName: string | null;

  // AIRSAR
  flightLine: string | null;

  // Baseline
  perpendicular: number | null;
  temporal: number | null;
}

export enum FlightDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export enum ColumnSortDirection {
  INCREASING = 'INCREASING',
  DECREASING = 'DECREASING',
  NONE = 'NONE',
}
