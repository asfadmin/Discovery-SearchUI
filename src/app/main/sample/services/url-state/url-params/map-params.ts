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
    return new mapStore.SetMapView(<models.MapViewType>val);
  }
}
