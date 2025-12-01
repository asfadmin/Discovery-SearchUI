import { TestBed } from '@angular/core/testing';

import { KmlFootprintService } from './kml-footprint.service';

describe('KmlFootprintService', () => {
  let service: KmlFootprintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmlFootprintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
