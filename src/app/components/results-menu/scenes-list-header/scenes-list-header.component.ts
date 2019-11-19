import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';

import { MapService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-scenes-list-header',
  templateUrl: './scenes-list-header.component.html',
  styleUrls: ['./scenes-list-header.component.scss']
})
export class ScenesListHeaderComponent implements OnInit {
  public totalResultCount$ = this.store$.select(searchStore.getTotalResultCount);
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(scenesStore.getNumberOfProducts);
  public allProducts$ = this.store$.select(scenesStore.getAllProducts);

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) { }

  ngOnInit() {
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  public queueAllProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public formatNumber(num: number): string {
    return (num || 0)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
}
