import { TestBed } from '@angular/core/testing';

import { UrlStateService } from './url-state.service';

describe('UrlStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UrlStateService = TestBed.get(UrlStateService);
    expect(service).toBeTruthy();
  });
});
