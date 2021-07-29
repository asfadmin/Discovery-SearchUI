
import { MapLayerTypes } from './map.model';
// import { SearchType } from '@models';
export interface UserAuth {
  id: string | null;
  token: string | null;
  groups: URSGroup[];
}

export interface UserProfile {
  defaultDataset: string;
  mapLayer: MapLayerTypes;
  maxResults: number;
  defaultMaxConcurrentDownloads;
  defaultFilterPresets: {
    'Baseline Search': string,
    'Geographic Search': string,
    'SBAS Search': string
  };
}

export interface URSGroup {
  app_uid: string;
  client_id: string;
  name: string;
}
