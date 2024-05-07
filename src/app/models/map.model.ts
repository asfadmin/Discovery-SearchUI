export const mapOptions = {
  wrapX: true,
};

export enum MapLayerTypes {
  STREET = 'Street',
  SATELLITE = 'Satellite',
}

export enum MapViewType {
  ARCTIC = 'arctic',
  EQUATORIAL = 'equatorial',
  ANTARCTIC = 'antarctic',
}

export enum MapDrawModeType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
  BOX = 'Box',
  CIRCLE = 'Circle'
}

export enum MapInteractionModeType {
  DRAW = 'Draw',
  EDIT = 'Edit',
  UPLOAD = 'Upload',
  NONE = 'None',
  CLEAR = 'Clear',
  TIMERSERIES = 'TimeSeries',
}

export enum DrawPolygonStyle {
  VALID = 'Valid',
  INVALID = 'Invalid',
  OMITTED = 'Omitted'
}

export interface LonLat {
  lon: number;
  lat: number;
}
