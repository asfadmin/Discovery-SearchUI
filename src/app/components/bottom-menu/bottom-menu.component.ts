import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { map, withLatestFrom, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as models from '@models';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss'],
  animations: [
    trigger('changeMenuY', [
      state('shown', style({ transform: 'translateY(0%)'
      })),
      state('hidden',   style({
        transform: 'translateY(100%) translateY(-36px)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ]),
  ],
})
export class BottomMenuComponent {
  public isBottomMenuOpen$ = this.store$.select(uiStore.getIsBottomMenuOpen);

  public searchPlatform$ = this.store$.select(searchStore.getIsLoading).pipe(
    withLatestFrom(this.store$.select(filtersStore.getSelectedPlatforms)),
    filter(([isLoading, _]) => !isLoading),
    map(([_, platforms]) => platforms),
    map(platforms => Array.from(platforms || []).pop())
  );

  public numberOfGranules$ = this.store$.select(granulesStore.getNumberOfGranules);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);
  public queuedProductIds$ = this.store$.select(queueStore.getQueuedProductIds).pipe(
    map(names => new Set(names))
  );

  public areNoGranules$ = this.store$.select(granulesStore.getGranules).pipe(
    map(granules => granules.length === 0)
  );

  public isHidden$ = this.store$.select(uiStore.getIsHidden);

  constructor(private store$: Store<AppState>) { }

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleBottomMenu());
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  private selectNextGranule(): void {
    this.store$.dispatch(new granulesStore.SelectNextGranule());
  }

  private selectPreviousGranule(): void {
    this.store$.dispatch(new granulesStore.SelectPreviousGranule());
  }

}
