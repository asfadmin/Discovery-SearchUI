import { TestBed } from '@angular/core/testing';

import { AsfApiService } from './asf-api.service';

describe('AsfApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsfApiService = TestBed.get(AsfApiService);
    expect(service).toBeTruthy();
  });
});
