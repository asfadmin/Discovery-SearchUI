import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as filtersStore from '@store/filters';
import * as scenesStore from '@store/scenes';

import * as models from '@models';
import { SubSink } from 'subsink';
import { PairService, ScenesService } from '@services';

@Component({
  selector: 'app-max-results-selector',
  templateUrl: './max-results-selector.component.html',
  styleUrls: ['./max-results-selector.component.scss']
})
export class MaxResultsSelectorComponent implements OnInit, OnDestroy {
  public maxResults: number;
  public numberOfScenes: number;
  public isMaxResultsLoading: boolean;
  public currentSearchAmount: number;
  public areResultsLoaded = false;

  public searchType: models.SearchType;
  public searchTypes = models.SearchType;
  public sbasProducts: models.CMRProduct[];

  public burstXMLFileCount: number = 0;

  public possibleMaxResults = [250, 1000, 5000];
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private pairService: PairService,
    private sceneService: ScenesService,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getMaxSearchResults).subscribe(
        maxResults => this.maxResults = maxResults
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getIsMaxResultsLoading).subscribe(
        isLoading => this.isMaxResultsLoading = isLoading
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchAmount).subscribe(
        amount => this.currentSearchAmount = Number.isNaN(amount) ? 0 : amount
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getAreResultsLoaded).subscribe(
        areLoaded => this.areResultsLoaded = areLoaded
      )
    );

    this.subs.add(
      this.sceneService.scenes$().subscribe(
        scenes => {
          this.numberOfScenes = scenes.length;
          this.burstXMLFileCount = scenes.filter(p => p.metadata.productType === 'BURST').length
        })
    );

    this.subs.add(
      this.pairService.productsFromPairs$().subscribe(
        products => this.sbasProducts = products
      )
    );

  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));

    if (this.areResultsLoaded) {
      this.store$.dispatch(new searchStore.MakeSearch());
    }
  }


  public formatNumber(num: number): string {
    if (typeof num !== 'number') {
      return '';
    }

    return num
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
