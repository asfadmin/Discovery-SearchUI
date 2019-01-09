import { Action } from '@ngrx/store';

import { UrlParameter } from './url-param';

import * as mapStore from './../../../store/map';
import * as models from './../../../models';


export class View extends UrlParameter {
  public name(): string {
    return 'view';
  }

  protected isValid(val: string): boolean {
    return Object.values(models.MapViewType).includes(val);
  }

  public loadParameter(val: string): Action {
    return getActionFor(<models.MapViewType>val);
  }
}

const getActionFor = (view: models.MapViewType): Action => {
  switch (view) {
    case models.MapViewType.ARCTIC: {
      return new mapStore.SetArcticView();
    }
    case models.MapViewType.EQUITORIAL: {
      return new mapStore.SetEquitorialView();
    }
    case models.MapViewType.ANTARCTIC: {
      return new mapStore.SetAntarcticView();
    }
  }
};
