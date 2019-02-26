import { async } from '@angular/core/testing';
import {AsfApiService} from './asf-api.service';

describe('AsfApiService', () => {
  let service;

  const http: any = {
    // mock properties here 
  }

  beforeEach(() => {
    service = new AsfApiService(http);
  });

  it('should run #query()', async () => {
    // const result = query(stateParams);
  });

  it('should run #upload()', async () => {
    // const result = upload(files);
  });

  it('should run #validate()', async () => {
    // const result = validate(wkt);
  });

  it('should run #isUrlToLong()', async () => {
    // const result = isUrlToLong(url, params);
  });

  it('should run #dummyData()', async () => {
    // const result = dummyData();
  });

  it('should run #baseParams()', async () => {
    // const result = baseParams();
  });

});
