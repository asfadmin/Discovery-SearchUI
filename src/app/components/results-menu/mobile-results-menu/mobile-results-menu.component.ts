import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import { DatasetForProductService } from '@services';
import { SubSink } from 'subsink';

import { CMRProductPair, SearchType } from '@models';

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

  public isDisconnected = false;
  public pair: CMRProductPair;
  public isAddingCustomPoint: boolean;
  public isSelectedPairCustom: boolean;

  public view = MobileViews.SBAS;
  public Views = MobileViews;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public searchType: SearchType;
  public SearchTypes = SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    public datasetForProduct: DatasetForProductService,
  ) { }

  ngOnInit(): void {
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
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
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
  public isGraphDisconnected(disconnect: boolean) {
    console.log(disconnect);
    this.isDisconnected = disconnect;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
