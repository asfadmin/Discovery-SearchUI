import { TestBed } from '@angular/core/testing';

import { Hyp3JobService } from './hyp3-job.service';
import * as testJobs from './testing-jobs/jobs';

describe('Hyp3JobService', () => {
  let hyp3JobService: Hyp3JobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    hyp3JobService = TestBed.inject(Hyp3JobService);
  });

  it('failed jobs with no files should work', () => {
    const jobs = [(testJobs.failedJobWithEmptyFiles as any)];

    const dummyProducts = hyp3JobService.toDummyCMRProducts(jobs);

    expect(dummyProducts.length === 1).toBeTruthy();
  });

  it('aria s1 jobs should not be skipped', () => {
    const jobs = [(testJobs.ariaS1Job as any)];

    const dummyProducts = hyp3JobService.toDummyCMRProducts(jobs);

    expect(dummyProducts.length !== 0).toBeTruthy();
  });
});
