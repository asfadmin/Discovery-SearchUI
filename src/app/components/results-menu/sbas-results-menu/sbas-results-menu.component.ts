import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';

import { Breakpoints, CMRProductPair, SearchType } from '@models';
import { ScreenSizeService, DatasetForProductService } from '@services';

import { SubSink } from 'subsink';

enum CardViews {
  LIST = 0,
  DETAIL = 1
}

@Component({
  selector: 'app-sbas-results-menu',
  templateUrl: './sbas-results-menu.component.html',
  styleUrls: ['./sbas-results-menu.component.scss',  '../results-menu.component.scss']
})
export class SBASResultsMenuComponent implements OnInit, OnDestroy {

  @ViewChild('listCard', {read: ElementRef}) listCardView: ElementRef;
  @ViewChild('chartCard', {read: ElementRef}) chartCardView: ElementRef;

  @Input() resize$: Observable<void>;
  public searchType: SearchType;

  public pair: CMRProductPair;
  public isAddingCustomPoint: boolean;

  public view = CardViews.LIST;
  public Views = CardViews;

  public listCardMaxWidth = '38%';
  public chartCardMaxWidth = '55%';

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  public isSelectedPairCustom: boolean;
  private subs = new SubSink();

  public zoomInChart$ = new Subject();
  public zoomOutChart$ = new Subject();
  public zoomToFitChart$ = new Subject();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public datasetForProduct: DatasetForProductService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
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

  public onResizeEnd(event: ResizeEvent): void {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const newChartWidth = event.rectangle.width > windowWidth ? windowWidth : event.rectangle.width;
    const newChartMaxWidth = Math.round((newChartWidth / windowWidth) * 100);
    const newListMaxWidth = 100 - newChartMaxWidth;

    this.listCardMaxWidth = newListMaxWidth.toString() + '%';
    this.chartCardMaxWidth = newChartMaxWidth.toString() + '%';
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
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  public zoomIn(): void {
    this.zoomInChart$.next();
  }

  public zoomOut(): void {
    this.zoomOutChart$.next();
  }

  public zoomToFit(): void {
    this.zoomToFitChart$.next();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
