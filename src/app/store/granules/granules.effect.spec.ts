import { async } from '@angular/core/testing';
import {GranulesEffects} from './granules.effect';

describe('GranulesEffects', () => {
  let service;

  const actions$: any = {
    // mock properties here
  };

  const store$: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new GranulesEffects(actions$, store$);
  });

});
