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
  remaining: number;
  unlimited: boolean;
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
  TWENTY = '20',
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

export const on_demand_prod_collections = ['C1214471197-ASF','C1214470533-ASF','C1214471521-ASF','C1214472978-ASF','C1214470682-ASF','C1214472994-ASF','C1214470488-ASF','C1327985697-ASF','C1327985645-ASF','C1327985660-ASF','C1327985644-ASF','C1327985571-ASF','C1327985740-ASF','C1327985661-ASF','C1661710578-ASF','C1661710581-ASF','C1661710583-ASF','C1661710590-ASF','C1661710593-ASF','C1661710596-ASF','C1661710597-ASF','C1661710604-ASF','C1214335471-ASF','C1214336154-ASF','C1214337770-ASF','C1214354144-ASF','C1214354235-ASF'];
export const on_demand_test_collections = ['C1212200781-ASF','C1212201032-ASF','C1212209035-ASF','C1212158327-ASF','C1212158318-ASF','C1205428742-ASF','C1216244597-ASF','C1216244589-ASF','C1216244594-ASF','C1216244588-ASF','C1216244586-ASF','C1216244600-ASF','C1216244348-ASF','C1226557819-ASF','C1226557809-ASF','C1226557808-ASF','C1226557812-ASF','C1226557813-ASF','C1226557814-ASF','C1226557815-ASF','C1226557818-ASF','C1206132445-ASF','C1212005594-ASF','C1207188317-ASF','C1210546638-ASF','C1206122195-ASF'];
export const on_demand_test_collections_asfdev = ['C1245830954-ASFDEV','C1245830954-ASFDEV','C1234413228-ASFDEV','C1234413229-ASFDEV','C1234413230-ASFDEV','C1234413239-ASFDEV','C1234413240-ASFDEV','C1234413241-ASFDEV','C1234413245-ASFDEV','C1234413246-ASFDEV','C1234413247-ASFDEV','C1234413248-ASFDEV','C1234413257-ASFDEV','C1234413258-ASFDEV','C1234413259-ASFDEV','C1234413263-ASFDEV','C1234413264-ASFDEV','C1234413265-ASFDEV','C1234413266-ASFDEV','C1234413269-ASFDEV','C1234413270-ASFDEV','C1234413271-ASFDEV','C1234413272-ASFDEV','C1234413275-ASFDEV'];
