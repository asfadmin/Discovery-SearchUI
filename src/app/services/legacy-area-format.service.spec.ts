import { TestBed } from '@angular/core/testing';

import { LegacyAreaFormatService } from './legacy-area-format.service';

describe('LegacyAreaFormatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegacyAreaFormatService = TestBed.get(LegacyAreaFormatService);
    expect(service).toBeTruthy();
  });
});
