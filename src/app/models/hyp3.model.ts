import * as moment from 'moment';

import { CMRProduct } from './cmr-product.model';
import { Hyp3JobType } from './hyp3-job-type.model';

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

export interface Hyp3JobParameters {
  granules: string[];

  // for jobs with multiple granules (InSAR and AutoRIFT)
  scenes?: CMRProduct[];

  // Hyp3RtcGammaParameters
  dem_matching?: boolean;
  include_dem?: boolean;
  include_inc_map?: boolean;
  include_scattering_area?: boolean;
  include_rgb: boolean;
  radiometry?: RtcGammaRadiometry;
  resolution?: RtcGammaResolution;
  scale?: RtcGammaScale;
  speckle_filter?: boolean;

  // Hyp3InSarGammaParameters
  include_look_vectors?: boolean;
  include_los_displacement?: boolean;
  looks?: InSarGammaLooks;

  dem_name: string;
}

export interface Hyp3InSarGammaParameters {
  granules: string[];
}


export interface Hyp3ProcessingOptions {
  [key: string]: any;
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
  THIRTY = '30',
  TEN = '10'
}

export enum RtcGammaScale {
  POWER = 'power',
  AMPLITUDE = 'amplitude',
  DECIBEL = 'decibel'
}

export enum Hyp3JobStatusCode {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED'
}
