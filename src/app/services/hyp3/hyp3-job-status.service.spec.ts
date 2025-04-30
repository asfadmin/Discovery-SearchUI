import { TestBed } from '@angular/core/testing';

import * as moment from 'moment';

import * as models from '@models';
import { Hyp3JobStatusService } from './hyp3-job-status.service';

describe('Hyp3JobStatusService', () => {
  let service: Hyp3JobStatusService;

  const expired = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.SUCCEEDED,
    expiration_time: moment.utc().subtract(2, 'days')
  };
  const notExpired = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.SUCCEEDED,
    expiration_time: moment.utc().add(2, 'days')
  };

  const failed = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.FAILED,
  };

  const succeded = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.SUCCEEDED,
  };
  const pending = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.PENDING,
  };

  const running = <models.Hyp3Job>{
    status_code: models.Hyp3JobStatusCode.RUNNING,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hyp3JobStatusService);
  });

  it('only downloadable products are returned', () => {
    expect(service.downloadable([]).length === 0).toBeTruthy();

    const products = [notExpired, failed, pending, running, expired].map(
      p => <models.CMRProduct>{metadata: { job: p }}
    );

    expect(service.downloadable(products).length === 1).toBeTruthy();
  });

  it('check if jobs are downloadable', () => {
    expect(service.isDownloadable(pending)).toBeFalsy();
    expect(service.isDownloadable(failed)).toBeFalsy();
    expect(service.isDownloadable(running)).toBeFalsy();
    expect(service.isDownloadable(expired)).toBeFalsy();

    expect(service.isDownloadable(notExpired)).toBeTruthy();
    expect(service.isDownloadable(null)).toBeTruthy();
  });

  it('have old jobs be expired', () => {
    expect(service.isExpired(expired)).toBeTrue();
  });

  it('have new jobs not be expired', () => {
    expect(service.isExpired(notExpired)).toBeFalsy();
  });

  it('check failed jobs correctly', () => {
    expect(service.isFailed(succeded)).toBeFalsy();
    expect(service.isFailed(failed)).toBeTruthy();
  });

  it('check other status codes correctly', () => {
    expect(service.isRunning(pending)).toBeFalsy();
    expect(service.isPending(running)).toBeFalsy();

    expect(service.isRunning(running)).toBeTruthy();
    expect(service.isPending(pending)).toBeTruthy();
  });
});
