import { TestBed } from '@angular/core/testing';

import { RemoteParseService } from './remote-parse.service';

describe('RemoteParseService', () => {
  let service: RemoteParseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteParseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
