import * as moment from 'moment';

import { CMRProduct } from './cmr-product.model';

export interface QueuedHyp3Job {
  granules: CMRProduct[];
  job_type: Hyp3JobType;
}

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
  job_names: string[];
}

export interface Hyp3UserQuota {
  max_jobs_per_month: number;
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
  granules: string[];
  dem_matching?: boolean;
  include_dem?: boolean;
  include_inc_map?: boolean;
  include_scattering_area?: boolean;
  radiometry?: RtcGammaRadiometry;
  resolution?: RtcGammaResolution;
  scale?: RtcGammaScale;
  speckle_filter?: boolean;
}

export interface Hyp3ProcessingOptions {
  // Hyp3RtcGammaProcessingOptions
  demMatching?: boolean;
  includeDem?: boolean;
  includeIncMap?: boolean;
  includeScatteringArea?: boolean;
  radiometry?: RtcGammaRadiometry;
  resolution?: RtcGammaResolution;
  scale?: RtcGammaScale;
  speckleFilter?: boolean;

  // Hyp3InSarProcessingOptions
  includeLookVectors?: boolean;
  includeLosDisplacement?: boolean;
  looks?: InSarGammaLooks;
}

export enum RtcGammaRadiometry {
  GAMMA0 = 'gamma0',
  SIGMA0 = 'sigma0'
}

export enum InSarGammaLooks {
  _20x4 = '20x4',
  _10x2 = '10x2'
}

export enum RtcGammaResolution {
  THIRTY = '30'
}

export enum RtcGammaScale {
  POWER = 'power',
  AMPLITUDE = 'amplitude'
}

export enum Hyp3JobType {
  RTC_GAMMA = 'RTC_GAMMA',
  INSAR_GAMMA = 'INSAR_GAMMA'
}

export enum Hyp3JobStatusCode {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED'
}
