
export type PolygonValidateResponse =
  | PolygonErrorResponse
  | PolygonRepairResponse;

export interface PolygonErrorResponse {
  error: PolygonError;
}

export interface PolygonError {
  type: PolygonErrorTypes;
  report: string;
}

export interface PolygonRepairResponse {
  wkt: string;
  repairs: PolygonRepair[];
}

export interface PolygonRepair {
  type: PolygonRepairTypes;
  report: string;
}

export enum PolygonRepairTypes {
  ROUND = 'ROUND',
  TRIM = 'TRIM',
  CLOSE = 'CLOSE',
  REVERSE = 'REVERSE',
}

export enum PolygonErrorTypes {
  SYNTAX = 'SYNTAX',
  TYPE = 'TYPE',
  SELF_INTERSECTION = 'SELF_INTERSECTIOn',
  UNKNOWN = 'UNKNOWN',
}
