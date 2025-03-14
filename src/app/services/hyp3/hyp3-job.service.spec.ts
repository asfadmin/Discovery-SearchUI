import { TestBed } from '@angular/core/testing';

import { Hyp3JobService } from './hyp3-job.service';

describe('Hyp3JobService', () => {
  let service: Hyp3JobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hyp3JobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
