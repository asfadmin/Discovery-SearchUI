export type PolygonValidateResponse =
  | PolygonErrorResponse
  | PolygonRepairResponse;

export interface PolygonErrorResponse {
  error: PolygonError;
}

export enum AsfApiOutputFormat {
  CSV = 'CSV',
  JSON = 'JSON' ,
  KML = 'KML',
  METALINK = 'METALINK',
  COUNT = 'COUNT',
  DOWNLOAD = 'DOWNLOAD',
  GEOJSON = 'GEOJSON',
  JSONLITE = 'JSONLITE'
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
  WRAP = 'WRAP',
}

export enum PolygonErrorTypes {
  SYNTAX = 'SYNTAX',
  TYPE = 'TYPE',
  SELF_INTERSECTION = 'SELF_INTERSECTIOn',
  UNKNOWN = 'UNKNOWN',
}
