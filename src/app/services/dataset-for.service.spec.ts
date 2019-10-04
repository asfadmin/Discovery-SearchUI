import { TestBed } from '@angular/core/testing';

import { DatasetForService } from './dataset-for.service';

describe('DatasetForService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetForService = TestBed.get(DatasetForService);
    expect(service).toBeTruthy();
  });
});
