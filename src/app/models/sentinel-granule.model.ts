export interface Sentinel1Product {
  name: string;
  file: string;
  downloadUrl: string;
  bytes: number;
  browse: string;
  platform: string;
  groupId: string;
  metadata: Sentinel1Metadata;
}

export interface Sentinel1Metadata {
  date: Date;
  polygon: string;

  productType: Sentinel1ProductType;
  beamMode: Sentinel1BeamMode;
  polarization: Sentinel1Polarization;
  flightDirection: FlightDirection;
  frequency: string;

  path: number;
  frame: number;
  absoluteOrbit: number;
}

export enum FlightDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}

export type Sentinel1ProductType =
  'GRD' | 'SLC' | 'OCN' | 'RAW' |
  'METADATA_SLC'
;

export type Sentinel1BeamMode =
  'IW'| 'EW'| 'WV'|
  'S1'| 'S2'| 'S3'|
  'S4'| 'S5'| 'S6';

export type Sentinel1Polarization =
  'HH'|
  'VV'|
  'HH+HV'|
  'VV+VH';

export const testProduct: Sentinel1Product = {
  name: 'SomeGranule',
  file: 'SomeGranule.zip',
  downloadUrl: 'www.download.edu',
  bytes: 7,
  browse: 'browse.png',
  platform: 'Sentinel-1A',
  groupId: '7',
  metadata: {
    date: new Date('December 17, 1995 03:24:00'),
    polygon: 'POINT(-121.28,58.76)',

    productType: 'GRD',
    beamMode: 'IW',
    polarization: 'HH',
    flightDirection: FlightDirection.ASCENDING,
    frequency: '7',

    path: 7,
    frame: 7,
    absoluteOrbit: 7,
  }
};
