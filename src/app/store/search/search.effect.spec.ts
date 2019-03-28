import { async } from '@angular/core/testing';
import {SearchEffects} from './search.effect';

xdescribe('SearchEffects', () => {
  let service;

  const actions$: any = {
    // mock properties here
  };

  const store$: any = {

  };

  const searchParams$: any = {
    // mock properties here
  };

  const asfApiService: any = {
    // mock properties here
  };

  const productService: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new SearchEffects(actions$, store$, searchParams$, asfApiService, productService);
  });

});
