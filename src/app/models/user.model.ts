
import { MapLayerTypes } from './map.model';

export interface UserAuth {
  id: string | null;
  token: string | null;
}

export interface UserProfile {
  defaultDataset: string;
  mapLayer: MapLayerTypes;
  maxResults: number;
}
