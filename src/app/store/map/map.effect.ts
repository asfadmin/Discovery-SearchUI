import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MapService } from '@services';
import { AppState } from '@store';
import { ScenesActionType, SetImageBrowseProducts, SetSelectedSarviewsEvent } from '@store/scenes/scenes.action';
import { getSearchType, SearchActionType, SetSearchType } from '@store/search';
import { map, tap, withLatestFrom } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { map, catchError, switchMap, withLatestFrom } from 'rxjs/operators';
// import * as uiActions from './ui.action';
// import * as filtersStore from '@store/filters';
// import { getSearchType } from '@store/search/search.reducer';

// import { BannerApiService } from '../../services/banner-api.service';
// import { Store } from '@ngrx/store';
// import { AppState } from '@store';
// import { SearchType } from '@models';

@Injectable()
export class MapEffects {

  public constructor(private actions$: Actions,
    private mapService: MapService,
    private store$: Store<AppState>) {}
  public loadUnzippedProductFiles = createEffect(() => this.actions$.pipe(
  ));

  public clearBrowseOverlaysOnNewEvent = createEffect(() => this.actions$.pipe(
    ofType<SetSelectedSarviewsEvent>(ScenesActionType.SET_SELECTED_SARVIEWS_EVENT),
    map(_ => new SetImageBrowseProducts({})),
    tap(_ => this.mapService.clearBrowseOverlays())
  ));

  public clearPinnedProducts = createEffect((() => this.actions$.pipe(
    ofType<SetSearchType>(SearchActionType.SET_SEARCH_TYPE_AFTER_SAVE),
    tap(_ => this.mapService.clearBrowseOverlays()),
    map(_ => new SetImageBrowseProducts({}))
  )));

  public setSearchOverlays = createEffect(() => this.actions$.pipe(
    ofType<SetImageBrowseProducts>(ScenesActionType.SET_IMAGE_BROWSE_PRODUCTS),
    withLatestFrom(this.store$.select(getSearchType)),
    tap(([action, _]) => this.mapService.setPinnedProducts(action.payload)),
  ), {dispatch: false})

}
