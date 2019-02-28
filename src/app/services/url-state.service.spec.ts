import { async } from '@angular/core/testing';
import {UrlStateService} from './url-state.service';

describe('UrlStateService', () => {
  let service;

  const store$: any = {
    // mock properties here
  };

  const activatedRoute: any = {
    // mock properties here
  };

  const mapService: any = {
    // mock properties here
  };

  const wktService: any = {
    // mock properties here
  };

  const rangeService: any = {
    // mock properties here
  };

  const router: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new UrlStateService(store$, activatedRoute, mapService, wktService, rangeService, router);
  });

  it('should run #load()', async () => {
    // load();
  });

  it('should run #loadStateFrom()', async () => {
    // loadStateFrom(params);
  });

  it('should run #uiParameters()', async () => {
    // const result = uiParameters();
  });

  it('should run #filtersParameters()', async () => {
    // const result = filtersParameters();
  });

  it('should run #objToString()', async () => {
    // const result = objToString(obj, key);
  });

  it('should run #mapParameters()', async () => {
    // const result = mapParameters();
  });

  it('should run #parseValuesByPlatform()', async () => {
    // const result = parseValuesByPlatform(str);
  });

});
