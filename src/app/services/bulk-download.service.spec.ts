import { async } from '@angular/core/testing';
import {BulkDownloadService} from './bulk-download.service';

describe('BulkDownloadService', () => {
  let service;

  const http: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new BulkDownloadService(http);
  });

  it('should run #downloadScript$()', async () => {
    // const result = downloadScript$(products);
  });

});
