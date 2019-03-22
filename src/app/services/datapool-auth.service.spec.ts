import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { DatapoolAuthService } from './datapool-auth.service';

describe('DatapoolAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: DatapoolAuthService = TestBed.get(DatapoolAuthService);
    expect(service).toBeTruthy();
  });
});
