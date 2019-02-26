import { async } from '@angular/core/testing';
import {SearchParamsService} from './search-params.service';

describe('SearchParamsService', () => {
  let service;

  const store$: any = {
    // mock properties here 
  }

  const mapService: any = {
    // mock properties here 
  }

  const rangeService: any = {
    // mock properties here 
  }

  beforeEach(() => {
    service = new SearchParamsService(store$,mapService,rangeService);
  });

  it('should run #getParams()', async () => {
    // const result = getParams();
  });

  it('should run #filterSearchParams$()', async () => {
    // const result = filterSearchParams$();
  });

  it('should run #listParam$()', async () => {
    // const result = listParam$();
  });

  it('should run #searchPolygon$()', async () => {
    // const result = searchPolygon$();
  });

  it('should run #selectedPlatforms$()', async () => {
    // const result = selectedPlatforms$();
  });

  it('should run #dateRange$()', async () => {
    // const result = dateRange$();
  });

  it('should run #pathRange$()', async () => {
    // const result = pathRange$();
  });

  it('should run #frameRange$()', async () => {
    // const result = frameRange$();
  });

  it('should run #productType$()', async () => {
    // const result = productType$();
  });

  it('should run #beamModes$()', async () => {
    // const result = beamModes$();
  });

  it('should run #polarizations$()', async () => {
    // const result = polarizations$();
  });

  it('should run #flightDirections$()', async () => {
    // const result = flightDirections$();
  });

  it('should run #maxResults$()', async () => {
    // const result = maxResults$();
  });

});
