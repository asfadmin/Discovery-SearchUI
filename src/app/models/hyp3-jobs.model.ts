import { sentinel_1 } from './dataset.model';
import { Hyp3JobType } from './hyp3-job-type.model';

export const RtcGammaJobType: Hyp3JobType = {
  id: 'RTC_GAMMA',
  name: 'RTC Gamma',
  numProducts: 1,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC', 'GRD_HD', 'GRD_HS'
    ],
    beamModes: ['IW'],
    polarizations: [
      'VV+VH', 'HH+HV', 'VV', 'HH',
    ]
  }]
};

export const InsarGammaJobType: Hyp3JobType = {
  id: 'INSAR_GAMMA',
  name: 'InSar Gamma',
  numProducts: 2,
  productTypes: [{
    dataset: sentinel_1,
    productTypes: [
      'SLC',
    ],
    beamModes: ['IW'],
    polarizations: [
      'VV+VH', 'HH+HV', 'VV', 'HH',
    ]
  }]
};

export const hyp3JobTypes = {
  RTCGamma: RtcGammaJobType,
  InSarGamma: InsarGammaJobType
};
