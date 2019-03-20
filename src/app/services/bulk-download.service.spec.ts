import { async, fakeAsync, tick, TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { BulkDownloadService } from './bulk-download.service';

describe('BulkDownloadService', () => {
  let service: BulkDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
      ],
      providers: [
        BulkDownloadService,
      ]
    });
    service = TestBed.get(BulkDownloadService);
  });

  it('should run #downloadScript$()', async () => {
    // const result = downloadScript$(products);
  });

});
