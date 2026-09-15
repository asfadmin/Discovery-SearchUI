import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

export interface UrlParameter {
  name: string;
  source: Observable<any>;
  loader: (string) => Action[] | Action | undefined;
}

export enum LoadTypes {
  URL = 'url',
  PROFILE = 'profile',
  DEFAULT = 'default',
}
