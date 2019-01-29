import { Observable } from 'rxjs';

export interface UrlParameter {
  name: string;
  source: Observable<any>;
  loader: (string) => void;
}
