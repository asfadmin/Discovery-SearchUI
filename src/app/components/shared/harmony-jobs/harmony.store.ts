import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  signalStore,
  withState,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  pipe,
  switchMap,
  tap,
} from 'rxjs';

import { HarmonyJob } from './harmony.model';
import { HarmonyService } from './harmony.service';

interface HarmonyState {
  jobs: HarmonyJob[];
  token: string | null;
  isLoading: boolean;
}

const initialState: HarmonyState = {
  jobs: [],
  token: null,
  isLoading: false,
};

export const HarmonyStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, harmony = inject(HarmonyService)) => ({
    setToken: (token: string | null) => patchState(store, { token }),
    getJobs: rxMethod<string | null>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((token): token is string => token !== null),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((token) =>
          harmony.getJobs$(token).pipe(
            tapResponse({
              next: (resp) =>
                patchState(store, { jobs: resp.jobs, isLoading: false }),
              error: (err) => {
                patchState(store, { jobs: [], isLoading: false });
                console.error(err);
              },
            }),
          ),
        ),
      ),
    ),
  })),
  withHooks({
    onInit: ({ getJobs, token }) => getJobs(token),
  }),
);
