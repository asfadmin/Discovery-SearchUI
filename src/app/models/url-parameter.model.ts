import { Observable } from 'rxjs';

export interface UrlParameter {
  name: string;
  source: Observable<any>;
  loader: (string) => void;
}

export enum LoadTypes {
  URL = 'url',
  PROFILE = 'profile',
  DEFAULT = 'default'
}
