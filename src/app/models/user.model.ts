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
  defaultMaxConcurrentDownloads: number;
  defaultFilterPresets: {
    'Baseline Search': string,
    'Geographic Search': string,
    'SBAS Search': string
  };
  hyp3BackendUrl: string;
  theme: string;
}

export interface URSGroup {
  app_uid: string;
  client_id: string;
  name: string;
}
