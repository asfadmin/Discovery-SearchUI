import { Action } from '@ngrx/store';

import { UrlParameter } from './url-param';

import * as filterStore from './../../../store/filters';
import * as models from './../../../models';


export class SelectedPlatforms extends UrlParameter {
  public name(): string {
    return 'selectedPlatforms';
  }

  public loadParameter(val: string): Action {
    const selectedPlatforms = val
      .split(',')
      .filter(name => models.platformNames.includes(name));

    return new filterStore.SetSelectedPlatforms(selectedPlatforms);
  }

  public toString(val: any): string {
    return Array.from(val).join(',');
  }
}
