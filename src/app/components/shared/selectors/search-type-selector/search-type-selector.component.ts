import { NgClass, AsyncPipe } from '@angular/common';
import { Component, ViewChild, Input, ElementRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardActions } from '@angular/material/card';
import { MatLabel, MatSuffix } from '@angular/material/input';
import { MatMenu, MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import * as models from '@models';
import { AnalyticsEvent, Breakpoints, derivedDatasets } from '@models';
import { EnvironmentService, ScreenSizeService } from '@services';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

import { DocsModalComponent } from '../../docs-modal/docs-modal.component';

// Declare GTM dataLayer array.
declare global {
  interface Window {
    dataLayer: any[];
  }
}

@Component({
  selector: 'app-search-type-selector',
  templateUrl: './search-type-selector.component.html',
  styleUrls: ['./search-type-selector.component.scss'],
  imports: [
    MatLabel,
    MatButton,
    MatMenuTrigger,
    MatTooltip,
    MatMenu,

    MatMenuItem,
    NgClass,
    DocsModalComponent,
    MatSuffix,
    MatCardActions,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SearchTypeSelectorComponent {
  translate = inject(TranslateService);
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  env = inject(EnvironmentService);

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatMenu) searchMenu: MatMenu;
  @ViewChild('firstItem') firstItem: ElementRef;
  @Input() selected: string;
  param = { value: ' world' };

  public searchType = this.store$.selectSignal(searchStore.getSearchType);
  public searchTypes = models.SearchType;
  public iconTypes = models.IconType;
  public searchTranslation = models.SearchTypeTranslation;
  public datasets = derivedDatasets;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public isLoggedIn = this.store$.selectSignal(userStore.getIsUserLoggedIn);
  public isReadMore = true;

  public isHyp3Plus = this.store$.selectSignal(searchStore.getHyp3PlusMode);

  public searchTypeSelectors: {
    search: models.SearchTypeSelector[];
    tools: models.SearchTypeSelector[];
  } = {
    search: [
      {
        searchType: models.SearchType.DATASET,
        nameKey: 'GEOGRAPHIC',
        descriptionKeys: [
          'GEOGRAPHIC_SEARCH_ALLOWS_YOU_TO_SEARCH_FOR_DATA_BASED_UPON_A_GEOGRAPHIC_LOCATION',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#geographic-search-options',
        icon: 'travel_explore',
        iconType: models.IconType.MATERIAL,
      },
      {
        searchType: models.SearchType.LIST,
        nameKey: 'LIST',
        descriptionKeys: [
          'LIST_SEARCH_ALLOWS_YOU_TO_ENTER_OR_UPLOAD_A_LIST_OF_SCENE_OR_FILE_NAMES',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#list-search-options',
        icon: 'list',
        iconType: models.IconType.MATERIAL,
      },
      {
        searchType: models.SearchType.SBAS,
        nameKey: 'SBAS',
        descriptionKeys: [
          'SBAS_SEARCH_PROVIDES_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_AS_WELL_AS_SCENE_PAIRS_FOR_A_CHOSEN',
          'REFERENCE_SCENE',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#sbas-search-options',
        icon: 'assets/icons/sbas-chart.jpg',
        iconType: models.IconType.IMAGE,
      },
      {
        searchType: models.SearchType.BASELINE,
        nameKey: 'BASELINE',
        descriptionKeys: [
          'BASELINE_SEARCH_PROVIDES_VISUALIZATION_OF_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_FOR_A_CHOSEN',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#baseline-search-options',
        icon: 'assets/icons/baseline-chart.jpg',
        iconType: models.IconType.IMAGE,
      },
      {
        searchType: models.SearchType.DISPLACEMENT,
        nameKey: 'DISPLACEMENT',
        descriptionKeys: ['DISPLACEMENT_DESCRIPTION'],
        helpUrl: 'https://docs.asf.alaska.edu/vertex/displacement/',
        icon: 'track_changes',
        iconType: models.IconType.MATERIAL,
      },
    ],

    tools: [
      {
        searchType: models.SearchType.DISPLACEMENT,
        nameKey: 'DISPLACEMENT',
        descriptionKeys: [
          'BASELINE_SEARCH_PROVIDES_VISUALIZATION_OF_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_FOR_A_CHOSEN',
          'REFERENCE_SCENE',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#baseline-search-options',
        icon: 'zoom',
        iconType: models.IconType.MATERIAL,
      },
      {
        searchType: models.SearchType.BASELINE,
        nameKey: 'BASELINE',
        descriptionKeys: [
          'BASELINE_SEARCH_PROVIDES_VISUALIZATION_OF_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_FOR_A_CHOSEN',
          'REFERENCE_SCENE',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#baseline-search-options',
        icon: 'assets/icons/baseline-chart.jpg',
        iconType: models.IconType.IMAGE,
      },
      {
        searchType: models.SearchType.SBAS,
        nameKey: 'SBAS',
        descriptionKeys: [
          'SBAS_SEARCH_PROVIDES_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_AS_WELL_AS_SCENE_PAIRS_FOR_A_CHOSEN',
          'REFERENCE_SCENE',
        ],
        helpUrl:
          'https://docs.asf.alaska.edu/vertex/manual/#sbas-search-options',
        icon: 'assets/icons/sbas-chart.jpg',
        iconType: models.IconType.IMAGE,
      },
    ],
  };

  public onSetSearchType(searchType: models.SearchType): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'search-type-selected',
      'search-type': searchType,
    });
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  public onOpenDerivedDataset(dataset_url: string, dataset_name: string): void {
    const analyticsEvent = {
      name: 'open-derived-dataset',
      value: dataset_name,
    };

    SearchTypeSelectorComponent.openNewWindow(dataset_url, analyticsEvent);
  }

  private static openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value,
    });

    window.open(url, '_blank');
  }

  public onOpenDocs(event) {
    this.trigger.closeMenu();
    event.stopPropagation();
  }

  public onCloseMenu(event: Event) {
    this.trigger.closeMenu();
    event.stopPropagation();
  }
}
