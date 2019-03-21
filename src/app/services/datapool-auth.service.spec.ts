import { TestBed } from '@angular/core/testing';

import { DatapoolAuthService } from './datapool-auth.service';

describe('DatapoolAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatapoolAuthService = TestBed.get(DatapoolAuthService);
    expect(service).toBeTruthy();
  });
});
