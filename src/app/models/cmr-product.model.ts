export interface CMRProduct {
  name: string;
  productTypeDisplay: string;
  file: string;
  id: string;
  downloadUrl: string;
  bytes: number;
  browse: string;
  thumbnail: string;
  platform: string;
  groupId: string;
  metadata: CMRProductMetadata;
}

export interface CMRProductMetadata {
  date: Date;
  polygon: string;

  productType: string;
  beamMode: string;
  polarization: string;
  flightDirection: FlightDirection;

  path: number;
  frame: number;
  absoluteOrbit: number;

  // ALOS PALSAR
  faradayRotation: number | null;
  offNadirAngle: number | null;

  // UAVSAR
  missionName: string | null;

  // AIRSAR
  flightLine: string | null;
}

export enum FlightDirection {
  ASCENDING = 'ASCENDING',
  DESCENDING = 'DESCENDING',
}
