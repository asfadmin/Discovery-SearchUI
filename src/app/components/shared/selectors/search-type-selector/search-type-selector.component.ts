import {Component, OnInit, OnDestroy, ViewChild, Input, ElementRef} from '@angular/core';
import { SubSink } from 'subsink';

import {MatMenu, MatMenuTrigger} from '@angular/material/menu';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

import * as models from '@models';

import { ScreenSizeService } from '@services';
import { AnalyticsEvent, Breakpoints, derivedDatasets } from '@models';
import { TranslateService } from "@ngx-translate/core";

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-search-type-selector',
  templateUrl: './search-type-selector.component.html',
  styleUrls: ['./search-type-selector.component.scss']

})
export class SearchTypeSelectorComponent implements OnInit, OnDestroy {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(MatMenu) searchMenu: MatMenu;
  @ViewChild('firstItem') firstItem: ElementRef;
  @Input() selected: string;
  param = {value: ' world'};


  public searchType: models.SearchType = models.SearchType.DATASET;
  public searchTypes = models.SearchType;
  public iconTypes = models.IconType;
  public searchTranslation = models.SearchTypeTranslation;
  public datasets = derivedDatasets;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public isLoggedIn = false;
  private subs = new SubSink();
  public isReadMore = true;

  public searchTypeSelectors: {'search':models.SearchTypeSelector[]; 'tools':models.SearchTypeSelector[] } = {
    'search':[
    {
      searchType: models.SearchType.DATASET,
      nameKey:'GEOGRAPHIC',
      descriptionKeys:['GEOGRAPHIC_SEARCH_ALLOWS_YOU_TO_SEARCH_FOR_DATA_BASED_UPON_A_GEOGRAPHIC_LOCATION'],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#geographic-search-options',
      icon:'travel_explore',
      iconType: models.IconType.MATERIAL,
    }, {
      searchType: models.SearchType.LIST,
      nameKey: 'LIST',
      descriptionKeys:['LIST_SEARCH_ALLOWS_YOU_TO_ENTER_OR_UPLOAD_A_LIST_OF_SCENE_OR_FILE_NAMES'],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#list-search-options',
      icon: 'list',
      iconType: models.IconType.MATERIAL,
    }, {
      searchType: models.SearchType.SARVIEWS_EVENTS,
      nameKey:'EVENT',
      descriptionKeys:['EVENT_SEARCH_HARNESSES_THE_CAPABILITIES_OF_SAR_PROCESSING_TO_MONITOR_NATURAL_DISASTERS'],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#event-search-options',
      icon:'volcano',
      iconType: models.IconType.MATERIAL,
    }
  ],

'tools':[
    {
      searchType: models.SearchType.BASELINE,
      nameKey:'BASELINE',
      descriptionKeys:[
        'BASELINE_SEARCH_PROVIDES_VISUALIZATION_OF_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_FOR_A_CHOSEN',
        'REFERENCE_SCENE',
      ],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#baseline-search-options',
      icon:'assets/icons/baseline-chart.jpg',
      iconType: models.IconType.IMAGE,
    }, {
      searchType: models.SearchType.SBAS,
      nameKey:'SBAS',
      descriptionKeys:[
        'SBAS_SEARCH_PROVIDES_PERPENDICULAR_AND_TEMPORAL_BASELINE_DATA_AS_WELL_AS_SCENE_PAIRS_FOR_A_CHOSEN',
        'REFERENCE_SCENE',
      ],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#sbas-search-options',
      icon:'assets/icons/sbas-chart.jpg',
      iconType: models.IconType.IMAGE,
    }, {
      searchType: models.SearchType.SARVIEWS_EVENTS,
      nameKey:'EVENT',
      descriptionKeys:['EVENT_SEARCH_HARNESSES_THE_CAPABILITIES_OF_SAR_PROCESSING_TO_MONITOR_NATURAL_DISASTERS'],
      helpUrl:'https://docs.asf.alaska.edu/vertex/manual/#event-search-options',
      icon:'volcano',
      iconType: models.IconType.MATERIAL,
    }
  ]};

  constructor(
    public translate: TranslateService,
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => {
          this.searchType = searchType
        }
      )
    );

    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onSetSearchType(searchType: models.SearchType): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'search-type-selected',
      'search-type': searchType
    });
    this.store$.dispatch(new searchStore.SetSearchType(searchType));
  }

  public onOpenDerivedDataset(dataset_url: string, dataset_name: string): void {

    const analyticsEvent = {
      name: 'open-derived-dataset',
      value: dataset_name
    };

    SearchTypeSelectorComponent.openNewWindow(dataset_url, analyticsEvent);
  }

  private static openNewWindow(url, analyticsEvent: AnalyticsEvent): void {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': analyticsEvent.name,
      'open-derived-dataset': analyticsEvent.value
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

  public onSearchTypeMenuOpen() {
    const panelId = this.searchMenu.panelId;
    document.getElementById(panelId).focus();
    setTimeout(() => {
      this.searchMenu.focusFirstItem();
      this.searchMenu.resetActiveItem();
    }, 10);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }


}
