import { TestBed } from '@angular/core/testing';

import { FrameMapService } from './frame-map.service';

describe('FrameMapService', () => {
  let service: FrameMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrameMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
