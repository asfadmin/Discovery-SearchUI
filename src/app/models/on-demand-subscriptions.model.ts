import { Range } from './range.model';
import { Hyp3JobType } from './hyp3-job-type.model';

export interface OnDemandSubscription {
  name: string;
  id: string;
  jobParameters: any;
  jobType: Hyp3JobType;
  filters: any;
  enabled: boolean;
}

export interface OnDemandSubscriptionFilters {
  polygon: string;
  dateRange: Range<null | Date>;
}
