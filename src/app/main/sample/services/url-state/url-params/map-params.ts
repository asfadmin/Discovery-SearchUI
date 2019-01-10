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

export class MapCenter extends UrlParameter {
  public name(): string {
    return 'mapCenter';
  }

  protected isValid(val: string): boolean {
    const vals = val.split(',');

    return vals.length === 2 && vals.every(v => !!(+v));
  }

  public loadParameter(val: string): Action {
    const [lon, lat] = val.split(',').map(v => +v);

    return new mapStore.SetMapCenter({ lon, lat });
  }

  public toString(val: models.LonLat): string {
    return `${val.lon},${val.lat}`;
  }
}


export class MapZoom extends UrlParameter {
  public name(): string {
    return 'mapZoom';
  }

  protected isValid(val: string): boolean {
    return !!(+val);
  }

  public loadParameter(val: string): Action {
    return new mapStore.SetMapZoom(+val);
  }
}
