export interface UserAuth {
  id: string | null;
  token: string | null;
}

export interface UserProfile {
  defaultDataset: string;
  view: string;
  maxResults: number;
}
