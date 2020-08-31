import * as moment from 'moment';

import { CMRProduct } from './cmr-product.model';

export interface Hyp3JobWithScene {
  job: Hyp3Job;
  scene: CMRProduct;
}

export interface Hyp3JobSubmissions {
  jobs: Hyp3JobSubmission;
}

export interface Hyp3JobSubmission {
  name: string;
  job_parameters: Hyp3JobParameters;
  job_type: Hyp3JobType;
}

export interface Hyp3User {
  quota: Hyp3UserQuota;
  user_id: string;
}

export interface Hyp3UserQuota {
  limit: number;
  remaining: number;
}

export interface Hyp3JobsResponse {
  jobs: Hyp3Job[];
}

export interface Hyp3Job {
  browse_images: string[];
  name: string;
  expiration_time: moment.Moment;
  files: Hyp3ProductFile[];
  job_id: string;
  job_parameters: Hyp3JobParameters;
  job_type: Hyp3JobType;
  request_time: moment.Moment;
  status_code: Hyp3JobStatusCode;
  thumbnail_images: string[];
  user_id: string;
}

export interface Hyp3ProductFile {
  filename: string;
  size: number;
  url: string;
}

export type Hyp3JobParameters =
  | Hyp3RtcGammaParameters;

export interface Hyp3RtcGammaParameters {
  granule: string;
}

export enum Hyp3JobType {
  RTC_GAMMA = 'RTC_GAMMA'
}

export enum Hyp3JobStatusCode {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED'
}
