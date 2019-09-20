import { TestBed } from '@angular/core/testing';

import { BrowseMapService } from './browse-map.service';

describe('BrowseMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrowseMapService = TestBed.get(BrowseMapService);
    expect(service).toBeTruthy();
  });
});
