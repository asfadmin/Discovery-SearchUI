import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import { DatasetForProductService } from '@services';
import { SubSink } from 'subsink';

import { CMRProductPair, SearchType } from '@models';
import { MatButton } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { SceneDetailComponent } from '../scene-detail/scene-detail.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SceneMetadataComponent } from '../../shared/scene-metadata/scene-metadata.component';
import { SceneFilesComponent } from '../scene-files/scene-files.component';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { BaselineChartComponent } from '../../baseline-chart/baseline-chart.component';
import { DocsModalComponent } from '../../shared/docs-modal/docs-modal.component';
import { SBASChartComponent } from '../../sbas-chart/sbas-chart.component';
import { SbasSlidersTwoComponent } from '../sbas-results-menu/sbas-sliders-two/sbas-sliders-two.component';
import { TranslateModule } from '@ngx-translate/core';

enum MobileViews {
  LIST = 0,
  DETAIL = 1,
  CHART = 2,
  SBAS,
}

@Component({
  selector: 'app-mobile-results-menu',
  templateUrl: './mobile-results-menu.component.html',
  styleUrls: [
    './mobile-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
  imports: [
    MatButton,
    NgIf,
    MatCard,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,
    SceneDetailComponent,
    NgFor,
    MatTooltip,
    SceneMetadataComponent,
    SceneFilesComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatIcon,
    BaselineChartComponent,
    DocsModalComponent,
    SBASChartComponent,
    SbasSlidersTwoComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class MobileResultsMenuComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  datasetForProduct = inject(DatasetForProductService);

  @Input() resize$: Observable<void>;

  public isDisconnected = false;
  public pair: CMRProductPair;
  public isAddingCustomPoint: boolean;
  public isSelectedPairCustom: boolean;

  public view = MobileViews.SBAS;
  public Views = MobileViews;

  public selectedProducts$ = this.store$.select(
    scenesStore.getSelectedSceneProducts,
  );

  public searchType: SearchType;
  public SearchTypes = SearchType;

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchType) => {
        this.searchType = searchType;
        this.view =
          searchType === SearchType.SBAS ? MobileViews.SBAS : MobileViews.LIST;
      }),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getIsSelectedPairCustom)
        .subscribe(
          (isPairCustom: boolean) => (this.isSelectedPairCustom = isPairCustom),
        ),
    );

    this.subs.add(
      this.store$
        .select(uiStore.getIsAddingCustomPoint)
        .subscribe(
          (isAddingCustomPoint) =>
            (this.isAddingCustomPoint = isAddingCustomPoint),
        ),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedPair)
        .subscribe((selected: CMRProductPair) => (this.pair = selected)),
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
    this.isDisconnected = disconnect;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
