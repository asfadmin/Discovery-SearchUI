import { async } from '@angular/core/testing';
import {QueueEffects} from './queue.effect';

xdescribe('QueueEffects', () => {
  let service;

  const actions$: any = {
    // mock properties here
  }

  const store$: any = {
    // mock properties here
  }

  const searchParams$: any = {
    // mock properties here
  }

  const asfApiService: any = {
    // mock properties here
  }

  const bulkDownloadService: any = {
    // mock properties here
  }

  beforeEach(() => {
    service = new QueueEffects(actions$,store$,searchParams$,asfApiService,bulkDownloadService);
  });

});
