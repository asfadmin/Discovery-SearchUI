import { Range } from './range.model';

export type SarviewsEvent = SarviewsQuakeEvent
  | SarviewsVolcanicEvent
  | SarviewsFloodEvent

export interface SarviewsQuakeEvent {
  depth: string;
  description: string;
  event_date: Date;
  event_id: string;
  event_type: string;
  magnitude: number;
  processing_timeframe: Range<null | Date>;
  usgs_event_id: string;
  wkt: string;
}

export interface SarviewsVolcanicEvent {
  description: string;
  event_id: string;
  event_type: string;
  processing_timeframe: Range<null | Date>;
  smithsonian_event_id: string;
  wkt: string;
}

export interface SarviewsFloodEvent {
  description: string;
  event_id: string;
  event_type: string;
  processing_timeframe: Range<null | Date>;
  wkt: string;
}

export const enum SarviewsEventType {
  QUAKE = 'quake',
  VOLCANO = 'volcano',
  FLOOD = 'flood'
}
