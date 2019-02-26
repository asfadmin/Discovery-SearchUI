import { async } from '@angular/core/testing';
import {SearchEffects} from './search.effect';

describe('SearchEffects', () => {
  let service;

  const actions$: any = {
    // mock properties here 
  }

  const searchParams$: any = {
    // mock properties here 
  }

  const asfApiService: any = {
    // mock properties here 
  }

  const productService: any = {
    // mock properties here 
  }

  beforeEach(() => {
    service = new SearchEffects(actions$,searchParams$,asfApiService,productService);
  });

});
