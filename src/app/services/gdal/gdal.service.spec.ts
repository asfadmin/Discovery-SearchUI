import { TestBed } from '@angular/core/testing';

import { GdalService } from './gdal.service';

describe('GdalService', () => {
  let service: GdalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GdalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
