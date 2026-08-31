import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  inject,
  computed,
} from '@angular/core';

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
import { AsyncPipe } from '@angular/common';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { SceneDetailComponent } from '../scene-detail/scene-detail.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SceneMetadataComponent } from '@components/shared/scene-metadata/scene-metadata.component';
import { SceneFilesComponent } from '../scene-files/scene-files.component';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { BaselineChartComponent } from '../../baseline-chart/baseline-chart.component';
import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { SBASChartComponent } from '../../sbas-chart/sbas-chart.component';
import { SbasSlidersTwoComponent } from '../sbas-results-menu/sbas-sliders-two/sbas-sliders-two.component';
import { SceneSearchToolbarComponent } from '@components/results-menu/scene-search-toolbar/scene-search-toolbar.component';
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

    MatCard,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,
    SceneDetailComponent,
    SceneSearchToolbarComponent,

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
  public pairBase = this.store$.selectSignal(scenesStore.getSelectedPair);
  public pair = computed(() => {
    return this.pairBase() as CMRProductPair;
  });
  public isAddingCustomPoint = this.store$.selectSignal(
    uiStore.getIsAddingCustomPoint,
  );
  public isSelectedPairCustom = this.store$.selectSignal(
    scenesStore.getIsSelectedPairCustom,
  );

  public view = MobileViews.SBAS;
  public Views = MobileViews;

  public selectedProducts$ = this.store$.select(
    scenesStore.getSelectedSceneProducts,
  );

  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public SearchTypes = SearchType;

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe((searchType) => {
        this.view =
          searchType === SearchType.SBAS ? MobileViews.SBAS : MobileViews.LIST;
      }),
    );
  }

  public startAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StartAddingCustomPoint());
  }

  public stopAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StopAddingCustomPoint());
  }

  public deleteSelectedPair(): void {
    this.store$.dispatch(new scenesStore.RemoveCustomPair(this.pair()));
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
