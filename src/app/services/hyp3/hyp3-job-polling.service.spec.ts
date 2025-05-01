import { TestBed } from '@angular/core/testing';

import { Hyp3JobPollingService } from './hyp3-job-polling.service';
import { Hyp3ApiService } from '.';
import { BehaviorSubject, of } from 'rxjs';

import * as models from '@models';
import { TestScheduler } from 'rxjs/testing';

describe('Hyp3JobPollingService', () => {
  let testScheduler: TestScheduler;
  let service: Hyp3JobPollingService;
  let hyp3Spy: jasmine.SpyObj<Hyp3ApiService>;

  const scenes$ = new BehaviorSubject<models.CMRProduct[]>([]);
  const searchType$ = new BehaviorSubject<models.SearchType>(models.SearchType.CUSTOM_PRODUCTS);
  const userId$ = new BehaviorSubject<models.SearchType>(null);

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Hyp3Service', ['getJobs$']);

    TestBed.configureTestingModule({
      providers: [Hyp3JobPollingService, { provide: Hyp3ApiService, useValue: spy }]
    });
    service = TestBed.inject(Hyp3JobPollingService);
    hyp3Spy = TestBed.inject(Hyp3ApiService) as jasmine.SpyObj<Hyp3ApiService>;

    // Still need to figure out how to test observables
    testScheduler = new TestScheduler((actual, expected) => {
      return expect(actual).toEqual(expected);
    });
  });

  it('should be created', () => {
    hyp3Spy.getJobs$.and.returnValue(of({ hyp3Jobs: [], next: '' }));

    const numFinished$ = service.pollHyp3Jobs$(searchType$, scenes$, userId$);

    numFinished$.subscribe(numFinished => {
      console.log(numFinished);
      expect(numFinished).toBeTruthy(numFinished === 0);
    });
  });
});
