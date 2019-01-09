import { Action } from '@ngrx/store';

import { UrlParameter } from './url-param';

import * as uiStore from './../../../store/ui';
import * as models from './../../../models';


export class IsFilterMenuOpen extends UrlParameter {
  public name(): string {
    return 'isFiltersMenuOpen';
  }

  public loadParameter(val: string): Action {
    return val !== 'false' ?
        new uiStore.OpenFiltersMenu() :
        new uiStore.CloseFiltersMenu();
  }
}

export class SelectedFilter extends UrlParameter {
  public name(): string {
    return 'selectedFilter';
  }

  public loadParameter(val: string): Action {
    return new uiStore.SetSelectedFilter(<models.FilterType>val);
  }

  protected isValid(val: string) {
     return Object.values(models.FilterType).includes(val);
  }
}
