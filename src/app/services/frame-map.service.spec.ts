import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

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
