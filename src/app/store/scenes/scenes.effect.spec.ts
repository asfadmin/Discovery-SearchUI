import { async } from '@angular/core/testing';
import {ScenesEffects} from './scenes.effect';

xdescribe('ScenesEffects', () => {
  let service;

  const actions$: any = {
    // mock properties here
  };

  const store$: any = {
    // mock properties here
  };

  beforeEach(() => {
    service = new ScenesEffects(actions$, store$);
  });

});
