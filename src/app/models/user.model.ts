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
  language: string;
}
export interface EarthdataUserInfo {
  first_name: string,
  last_name: string,
  email_address: string,
  country: string,
  uid: string,
  organization: string
}

export interface URSGroup {
  app_uid: string;
  client_id: string;
  name: string;
}
