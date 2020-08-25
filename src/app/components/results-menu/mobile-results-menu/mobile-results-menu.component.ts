import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import { ScreenSizeService, DatasetForProductService, ScenesService, PairService } from '@services';
import { SubSink } from 'subsink';

import { CMRProduct, CMRProductPair, SearchType } from '@models';
import {tap} from 'rxjs/operators';

enum MobileViews {
  LIST = 0,
  DETAIL = 1,
  CHART = 2,
  SBAS
}

@Component({
  selector: 'app-mobile-results-menu',
  templateUrl: './mobile-results-menu.component.html',
  styleUrls: ['./mobile-results-menu.component.scss', '../results-menu.component.scss']
})
export class MobileResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public pair: CMRProductPair;
  public isAddingCustomPoint: boolean;
  public isSelectedPairCustom: boolean;

  public view = MobileViews.SBAS;
  public Views = MobileViews;

  private selectedPair = [null, null];
  private scenes: CMRProduct[];
  private isAddingCustomPair: boolean;
  private pairs;
  private customPairs;

  private queuedProduct;


  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public searchType: SearchType;
  public SearchTypes = SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public datasetForProduct: DatasetForProductService,
    private scenesService: ScenesService,
    private pairService: PairService,
  ) { }

  ngOnInit(): void {

    const scenes$ = this.scenesService.scenes$();
    const pairs$ = this.pairService.pairs$();

    this.store$.select(scenesStore.getSelectedPair).pipe(
    ).subscribe(
      selected => this.selectedPair = selected
    );

    this.subs.add(
      this.store$.select(uiStore.getIsAddingCustomPoint).pipe(
        tap(_ => this.queuedProduct = null),
      ).subscribe(
        isAddingCustomPair => this.isAddingCustomPair = isAddingCustomPair
      )
    );

    this.subs.add(
      combineLatest(scenes$, pairs$).subscribe(([scenes, pairs]) => {
        this.scenes = scenes;
        this.pairs = pairs.pairs;
        this.customPairs = pairs.custom;
      })
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => {
          this.searchType = searchType;
          this.view = searchType === 'SBAS Search' ?
                      MobileViews.SBAS : MobileViews.LIST;
        }
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getIsSelectedPairCustom).subscribe(
        (isPairCustom: boolean) => this.isSelectedPairCustom = isPairCustom
      )
    );

    this.subs.add(
      this.store$.select(uiStore.getIsAddingCustomPoint).subscribe(
        isAddingCustomPoint => this.isAddingCustomPoint = isAddingCustomPoint
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedPair).subscribe(
        (selected: CMRProductPair) => this.pair = selected
      )
    );
    this.subs.add(

      combineLatest(scenes$, pairs$).subscribe(([scenes, pairs]) => {
        this.scenes = scenes;
        this.pairs = pairs.pairs;
        this.customPairs = pairs.custom;
      })
    );

  }

  public startAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StartAddingCustomPoint());
  }

  public stopAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StopAddingCustomPoint());
  }

  public deleteSelectedPair(): void {
    this.store$.dispatch(new scenesStore.RemoveCustomPair(this.pair));
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
  }

  public onSelectList(): void {
    this.view = MobileViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = MobileViews.DETAIL;
  }

  public onSelectChart(): void {
    this.view = MobileViews.CHART;
  }

  public onSelectSBASChart(): void {
    this.view = MobileViews.SBAS;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
