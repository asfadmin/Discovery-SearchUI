// import Point from 'ol/geom/Point';
import { LonLat } from './map.model';
import { Range } from './range.model';

// export type SarviewsEvent = SarviewsQuakeEvent
//   | SarviewsVolcanicEvent
//   | SarviewsFloodEvent

export interface SarviewsProcessedEvent extends SarviewsQuakeEvent, SarviewsVolcanicEvent {
  products: SarviewsProduct[];
}

export interface SarviewsQuakeEvent extends SarviewsEvent {
  depth: string;
  event_date: Date;
  magnitude: number;
  usgs_event_id: string;
}

export interface SarviewsVolcanicEvent extends SarviewsEvent {
  smithsonian_event_id: string;
}

// export interface SarviewsFloodEvent extends SarviewsEvent {
// }

export interface SarviewsEvent {
  description: string;
  event_id: string;
  event_type: string;
  processing_timeframe: Range<null | Date>;
  wkt: string;
  point: LonLat;
}

export enum SarviewsEventType {
  QUAKE = 'quake',
  VOLCANO = 'volcano',
  FLOOD = 'flood'
}

export interface SarviewsProduct {
  event_id: string;
  files: SarviewsFileDetails;
  granules: SarviewProductGranule[];
  job_type: string;
  processing_date: Date;
  product_id: string;
  status_code: string;
}

export interface SarviewsFileDetails {
  browse_url: string;
  product_name: string;
  product_url: string;
  thumbnail_url: string;
  product_size: number;
}

export interface SarviewProductGranule {
  acquisition_date: Date;
  frame: number;
  path: number;
  granule_name: string;
  wkt: string;
}
