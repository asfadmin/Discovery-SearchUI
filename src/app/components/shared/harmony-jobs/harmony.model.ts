export interface HarmonyJobsResp {
  count: number;
  jobs: HarmonyJob[];
  links: HarmonyLink[];
}

export interface HarmonyLink {
  href: string;
  rel: string;
  title: string;
  type: string;
}

export interface HarmonyJob {
  createdAt: string;
  dataExpiration: string;
  jobID: string;
  labels: string[];
  links: HarmonyLink[];
  message: string;
  numInputGranules: number;
  progress: number;
  request: string;
  serviceName: string;
  status: string;
  steps: string;
  updatedAt: string;
  username: string;
}
