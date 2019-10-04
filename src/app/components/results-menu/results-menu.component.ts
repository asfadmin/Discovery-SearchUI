import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import { MapService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-results-menu',
  templateUrl: './results-menu.component.html',
  styleUrls: ['./results-menu.component.scss'],
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
export class ResultsMenuComponent {
  public totalResultCount$ = this.store$.select(searchStore.getTotalResultCount);
  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);

  public allProducts$ = this.store$.select(scenesStore.getAllProducts);
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(scenesStore.getNumberOfProducts);
  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  public isHidden$ = this.store$.select(uiStore.getIsHidden);

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) { }

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleResultsMenu());
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  private selectNextScene(): void {
    this.store$.dispatch(new scenesStore.SelectNextScene());
  }

  private selectPreviousScene(): void {
    this.store$.dispatch(new scenesStore.SelectPreviousScene());
  }

  private queueAllProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public formatNumber(num: number): string {
    return (num || 0)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
