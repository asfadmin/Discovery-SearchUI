import { async } from '@angular/core/testing';
import {PolygonValidationService} from './polygon-validation.service';

describe('PolygonValidationService', () => {
  let service;

  const snackBar: any = {
    // mock properties here
  };

  const mapService: any = {
    // mock properties here
  };

  const asfApiService: any = {
    // mock properties here
  };

  const wktService: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new PolygonValidationService(snackBar, mapService, asfApiService, wktService);
  });

  it('should run #validate()', async () => {
    // validate();
  });

});
