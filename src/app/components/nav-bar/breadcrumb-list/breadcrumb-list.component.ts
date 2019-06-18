import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { tap, map, filter } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
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
  @Output() doSearch = new EventEmitter<void>();
  @Output() clearSearch = new EventEmitter<void>();

  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public isHoveringAOISelector = false;

  public filterTypes = BreadcrumbFilterType;
  public selectedFilter = BreadcrumbFilterType.NONE;
  public searchType: SearchType = SearchType.DATASET;

  public searchTypes = SearchType;
  public polygon: string;

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);
  public loading$ = this.store$.select(searchStore.getIsLoading);

  public maxResults$ = this.store$.select(filtersStore.getMaxSearchResults);
  public isMaxResultsLoading$ = this.store$.select(searchStore.getIsMaxResultsLoading);
  public currentSearchAmount$ = this.store$.select(searchStore.getSearchAmount);

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private mapService: MapService,
    private wktService: WktService,
    private dialog: MatDialog,
    private clipboard: ClipboardService,
  ) { }

  ngOnInit() {
    this.store$.select(uiStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );

    this.actions$.pipe(
      filter(action => action.type === filtersStore.FiltersActionType.CLEAR_DATASET_FILTERS),
      filter(_ => !!this.polygonForm),
    ).subscribe(_ => this.polygonForm.reset());

    const polygon$ = this.mapService.searchPolygon$;
    polygon$.pipe(
      tap(_ => {
        if (!this.polygonForm) {
          return;
        }

        try {
          this.polygonForm.form
            .controls['searchPolygon']
            .setErrors(null);
        } catch {}
      })
    ).subscribe(
      p => this.polygon = p
    );
  }

  public onDoSearch(): void {
    this.clearSelectedBreadcrumb();
    this.doSearch.emit();
  }

  public onClearSearch(): void {
    this.clearSearch.emit();
  }

  public onOpenDownloadQueue(): void {
    this.dialog.open(QueueComponent, {
      id: 'dlQueueDialog'
    });
  }

  public clearSelectedBreadcrumb(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.selectedFilter = BreadcrumbFilterType.NONE;
  }

  public onInputSearchPolygon(polygon: string): void {
    try {
      const features = this.wktService.wktToFeature(
        polygon,
        this.mapService.epsg()
      );

      this.mapService.setDrawFeature(features);
    } catch (e) {
      this.polygonForm.form
        .controls['searchPolygon']
        .setErrors({'incorrect': true});

      return;
    }

    this.polygonForm.form
      .controls['searchPolygon']
      .setErrors(null);
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
