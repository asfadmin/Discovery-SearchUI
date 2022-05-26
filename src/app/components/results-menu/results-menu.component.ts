import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { SubSink } from 'subsink';

import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from '@services';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';

import * as models from '@models';

@Component({
  selector: 'app-results-menu',
  templateUrl: './results-menu.component.html',
  styleUrls: ['./results-menu.component.scss'],
})
export class ResultsMenuComponent implements OnInit, OnDestroy {
  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);
  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public products: models.CMRProduct[];

  public menuHeightPx: number;

  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  public noSarviewsEvents$ = this.store$.select(scenesStore.getSarviewsEvents).pipe(
    filter(events => events !== undefined && events !== null),
    map(events => events.length === 0)
  );

  public imageViewerOpen$ = this.store$.select(uiStore.getIsBrowseDialogOpen);

  public resize$ = new Subject<void>();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isUnzipOpen: boolean;
  public searchType: models.SearchType;
  public SearchTypes = models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit() {
    this.menuHeightPx = this.defaultMenuHeight();

    this.subs.add(
      this.store$.select(scenesStore.getAllProducts).subscribe(
        products => {
          this.products = products;
        }
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getShowUnzippedProduct).subscribe(
        showUnzippedProduct => this.isUnzipOpen = showUnzippedProduct
      )
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(_) {
    const resultDiv = document.getElementById('result-div');

    if (!resultDiv || !resultDiv.style) {
      return;
    }

    resultDiv.style.height = `${this.defaultMenuHeight()}px`;
    this.resize$.next();
  }

  private defaultMenuHeight(): number {
    return document.documentElement.clientHeight * 0.40;
  }

  public validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX = 33;
    const { width, height } = event.rectangle;

    return !(
      width && height &&
      (width < MIN_DIMENSIONS_PX || height < MIN_DIMENSIONS_PX)
    );
  }

  public maxResultWindow(e: Event): void {
    e.stopPropagation();
    const maxHeight = window.innerHeight - 160;
    this.menuHeightPx = maxHeight;
    this.resize$.next();
  }

  public minResultWindow(e: Event): void {
    e.stopPropagation();
    this.menuHeightPx = 33;
    this.resize$.next();
  }

  public onResizeEnd(event: ResizeEvent): void {
    const maxHeight = window.innerHeight - 160;
    const newHeight = event.rectangle.height;

    this.menuHeightPx = Math.min(newHeight, maxHeight);

    this.resize$.next();
  }

  public onFinalResize() {
    this.resize$.next();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
