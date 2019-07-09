import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { tap, map, filter, delay } from 'rxjs/operators';
import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
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
  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  public aoiErrors$ = new Subject<void>();

  public canSearch$ = this.store$.select(searchStore.getCanSearch);
  public isAOIError = false;
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
      ofType<searchStore.MakeSearch>(searchStore.SearchActionType.MAKE_SEARCH),
    ).subscribe(
      _ => this.onSearch()
    );

    const polygon$ = this.mapService.searchPolygon$;
    polygon$.subscribe(
      p => this.polygon = p
    );

    this.aoiErrors$.pipe(
      tap(_ => {
        this.isAOIError = true;
        this.mapService.clearDrawLayer();
        this.polygonForm.reset();
        this.polygonForm.form
          .controls['searchPolygon']
          .setErrors({'incorrect': true});
      }),
      delay(820),
    ).subscribe(_ => {
      this.isAOIError = false;
      this.polygonForm.form
        .controls['searchPolygon']
        .setErrors(null);
    });
  }

  public onSearch(): void {
    this.clearSelectedBreadcrumb();
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
      this.aoiErrors$.next();
    }
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
