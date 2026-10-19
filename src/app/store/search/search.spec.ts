import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { describe, it, expect, beforeEach } from 'vitest';

import { SearchType } from '@models';
import { beta } from '@models/datasets';
import * as filtersStore from '@store/filters';
import testProviders from '@testing/providers';

import * as SearchActions from './search.action';
import { SearchEffects } from './search.effect';

describe('SearchEffects', () => {
  let effects: SearchEffects;
  let actions$: ReplaySubject<any>;

  beforeEach(() => {
    actions$ = new ReplaySubject(1);

    TestBed.configureTestingModule({
      providers: [
        ...testProviders,
        SearchEffects,
        provideMockActions(() => actions$),
        {
          provide: ToastrService,
          useValue: {
            success: () => {
              return '';
            },
            error: () => {
              return 'error';
            },
          },
        },
      ],
    });

    effects = TestBed.inject(SearchEffects);
  });

  it('should switch the dataset automatically when switching to pair selection', async () => {
    const watchedEffect = firstValueFrom(effects.setPairSelectionDefaults);

    actions$.next(
      new SearchActions.SetSearchTypeAfterSave(SearchType.PAIR_SELECTION),
    );

    await expect(watchedEffect).resolves.toEqual(
      new filtersStore.SetSelectedDataset(beta.id),
    );
  });
});
