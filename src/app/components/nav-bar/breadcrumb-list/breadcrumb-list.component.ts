import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { combineLatest } from 'rxjs';
import { tap, map, filter, withLatestFrom } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as granulesStore from '@store/granules';
import * as filtersStore from '@store/filters';
import * as queueStore from '@store/queue';

import { SearchType } from '@models';
import { MapService, WktService } from '@services';

import { MatDialog } from '@angular/material/dialog';
import { QueueComponent } from '@components/nav-bar/queue';

import * as models from '@models/index';

enum BreadcrumbFilterType {
  SEARCH_TYPE = 'Search Type',
  DATASET = 'Dataset',
  DATE = 'Date',
  AOI = 'Area of Interest',
  PATH_FRAME = 'Path/Frame',
  ADDITIONAL = 'Additional Filters',
  FILTERS_MENU = '...',
  NONE = 'None'
}

@Component({
  selector: 'app-breadcrumb-list',
  templateUrl: './breadcrumb-list.component.html',
  styleUrls: ['./breadcrumb-list.component.scss']
})
export class BreadcrumbListComponent implements OnInit {
  @Output() openQueue = new EventEmitter<void>();
  @Output() doSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  @Input() isLoading: boolean;

  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  public accent = 'primary';
  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public showCopyIcon = false;

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;

  public areProductsLoaded$ = this.store$.select(granulesStore.getAreProductsLoaded);
  public isFiltersMenuOpen$ = this.store$.select(uiStore.getIsFiltersMenuOpen);
  public searchAmount$ = this.store$.select(searchStore.getSearchAmount);
  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  public loading$ = this.store$.select(searchStore.getIsLoading);
  public searchTypeSub = this.store$.select(uiStore.getSearchType).subscribe(
    searchType => this.searchType = searchType
  );

  public searchType: SearchType = SearchType.DATASET;
  public searchTypes = SearchType;

  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults);
  public currentSearchAmount$ = this.store$.select(searchStore.getSearchAmount);

  public selectedPlatformName$ = this.store$.select(filtersStore.getSelectedPlatformName);

  public isAnyDateValues$ = this.store$.select(filtersStore.getIsAnyDateValues);
  public dateRangePreview$ = this.store$.select(filtersStore.getDatePreviewStr);

  public isAnyAOIValue$ = this.mapService.searchPolygon$.pipe(
    map(polygon => !!polygon)
  );

  public isAnyAdditionalFilters$ = combineLatest(
    this.store$.select(filtersStore.getIsAnyPathFrameValue),
    this.store$.select(filtersStore.getIsAnyAdditionalFilters)
  ).pipe(
    map(additional => additional.some(v => !!v))
  );

  public polygon$ = this.mapService.searchPolygon$;
  public polygon: string;

  public additionalFiltersPreview$ = this.store$.select(filtersStore.getNumberOfAdditionalFilters).pipe(
    map(amt => amt > 0 ? ` · ${amt}` : '')
  );

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private mapService: MapService,
    private wktService: WktService,
    private dialog: MatDialog,
    private clipboard: ClipboardService,
  ) { }

  ngOnInit() {
    this.actions$.pipe(
      filter(action => action.type === filtersStore.FiltersActionType.CLEAR_FILTERS)
    ).subscribe(_ => this.polygonForm.reset());

    this.polygon$.subscribe(p => this.polygon = p);
  }

  public onDoSearch(): void {
    this.clearSelectedBreadcrumb();
    this.doSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSelectedBreadcrumb();
    this.clearSearch.emit();
  }

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      width: '550px', height: '700px', minHeight: '50%'
    });
  }

  public clearSelectedBreadcrumb(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onInputSearchPolygon(polygon: string): void {
    const features = this.wktService.wktToFeature(
      polygon,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    return features;
  }

  public onClearDateRange(): void {
    this.store$.dispatch(new filtersStore.ClearDateRange());
    this.store$.dispatch(new filtersStore.ClearSeason());
  }

  public onNewSelectedFilter(filterType: BreadcrumbFilterType): void {
    this.selectedFilter = this.selectedFilter === filterType ?
      BreadcrumbFilterType.NONE : filterType;

    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onSetSearchType(searchType: SearchType): void {
    this.clearSelectedBreadcrumb();
    this.store$.dispatch(new uiStore.SetSearchType(searchType));
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }
}
