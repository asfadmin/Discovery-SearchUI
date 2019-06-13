export const mapOptions = {
  wrapX: true,
};

export enum MapViewType {
  ARCTIC = 'arctic',
  EQUITORIAL = 'equitorial',
  EQUITORIAL_STREET = 'equitorial-street',
  ANTARCTIC = 'antarctic',
}

export enum MapDrawModeType {
  POINT = 'Point',
  LINESTRING = 'LineString',
  POLYGON = 'Polygon',
  BOX = 'Box',
}

export enum MapInteractionModeType {
  DRAW = 'Draw',
  EDIT = 'Edit',
  UPLOAD = 'Upload',
  NONE = 'None',
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
