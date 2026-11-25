import { TestBed } from '@angular/core/testing';

import { HarmonyService } from './harmony.service';

describe('HarmonyService', () => {
  let service: HarmonyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HarmonyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
