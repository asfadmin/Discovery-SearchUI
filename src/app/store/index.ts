import { MetaReducer } from '@ngrx/store';

import { environment } from '../../environments/environment';

import { reducers, AppState } from './reducers';
export { appEffects } from './effects';

export { reducers, AppState };
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
