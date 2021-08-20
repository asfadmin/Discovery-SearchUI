import { Range } from './range.model';

// export type SarviewsEvent = SarviewsQuakeEvent
//   | SarviewsVolcanicEvent
//   | SarviewsFloodEvent

export interface SarviewsQuakeEvent extends SarviewsEvent {
  depth: string;
  event_date: Date;
  magnitude: number;
  usgs_event_id: string;
}

export interface SarviewsVolcanicEvent extends SarviewsEvent {
  smithsonian_event_id: string;
}

export interface SarviewsFloodEvent extends SarviewsEvent {
}

export interface SarviewsEvent {
  description: string;
  event_id: string;
  event_type: string;
  processing_timeframe: Range<null | Date>;
  wkt: string;
  coordinates: number[]
}

export const enum SarviewsEventType {
  QUAKE = 'quake',
  VOLCANO = 'volcano',
  FLOOD = 'flood'
}
