import { Component, OnInit } from '@angular/core';
import {
  trigger, state, style,
  animate, transition
} from '@angular/animations';


import { map, withLatestFrom, tap, filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import * as models from '@models';
import * as services from '@services';

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
export class BottomMenuComponent implements OnInit {
  public isBottomMenuOpen$ = this.store$.select(uiStore.getIsBottomMenuOpen);
  public isSideMenuOpen$ = this.store$.select(uiStore.getIsSidebarOpen);
  public searchType$ = this.store$.select(uiStore.getSearchType);

  public searchPlatform$ = this.store$.select(searchStore.getIsLoading).pipe(
    withLatestFrom(this.store$.select(filtersStore.getSelectedPlatforms)),
    filter(([isLoading, _]) => !isLoading),
    map(([_, platforms]) => platforms),
    map(platforms => Array.from(platforms || []).pop())
  );

  public selectedGranule$ = this.store$.select(granulesStore.getSelectedGranule);
  public selectedProducts$ = this.store$.select(granulesStore.getSelectedGranuleProducts);
  public queuedProductIds: Set<string>;

  public granules$ = this.store$.select(granulesStore.getGranules);

  public isHidden = false;

  constructor(
    private store$: Store<AppState>,
    private wktService: services.WktService,
    private mapService: services.MapService,
  ) { }

  ngOnInit() {
    this.store$.select(uiStore.getIsHidden).subscribe(
      isHidden => this.isHidden = isHidden
    );

    this.store$.select(queueStore.getQueuedProductIds).pipe(
      map(names => new Set(names))
    ).subscribe(
      ids => this.queuedProductIds = new Set(ids)
    );
  }

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleBottomMenu());
  }

  public onNewFocusedGranule(granule: models.CMRProduct): void {
    this.store$.dispatch(new granulesStore.SetFocusedGranule(granule));
  }

  public onClearFocusedGranule(): void {
    this.store$.dispatch(new granulesStore.ClearFocusedGranule());
  }

  public onNewGranuleSelected(name: string): void {
    this.store$.dispatch(new granulesStore.SetSelectedGranule(name));
  }

  public onQueueGranuleProducts(name: string): void {
    this.store$.dispatch(new queueStore.QueueGranule(name));
  }

  public onToggleQueueProduct(product: models.CMRProduct): void {
    this.store$.dispatch(new queueStore.ToggleProduct(product));
  }

  public onZoomTo(granule: models.CMRProduct): void {
  }
}
