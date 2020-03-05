
import { MapLayerTypes } from './map.model';

export interface UserAuth {
  id: string | null;
  token: string | null;
  groups: URSGroup[];
}

export interface UserProfile {
  defaultDataset: string;
  mapLayer: MapLayerTypes;
  maxResults: number;
}

export interface URSGroup {
  app_uid: string;
  client_id: string;
  name: string;
}
