import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

export interface UrlParameter {
  name: string;
  source: Observable<any>;
  loader: (string) => (Action[] | Action | undefined);
}

export enum LoadTypes {
  URL = 'url',
  PROFILE = 'profile',
  DEFAULT = 'default'
}
