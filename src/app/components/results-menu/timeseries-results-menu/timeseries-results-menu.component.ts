import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import { Breakpoints,  SearchType } from '@models';
import { ScreenSizeService } from '@services';

import { SubSink } from 'subsink';


@Component({
  selector: 'app-timeseries-results-menu',
  templateUrl: './timeseries-results-menu.component.html',
  styleUrl: './timeseries-results-menu.component.scss'
})
export class TimeseriesResultsMenuComponent implements OnInit, OnDestroy {

  @ViewChild('listCard', {read: ElementRef}) listCardView: ElementRef;
  @ViewChild('chartCard', {read: ElementRef}) chartCardView: ElementRef;

  @Input() resize$: Observable<void>;
  public searchType: SearchType;


  public listCardMaxWidth = '38%';
  public chartCardMaxWidth = '55%';
  private minChartWidth = 25.0;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  public isSelectedPairCustom: boolean;
  private subs = new SubSink();

  public zoomInChart$ = new Subject<void>();
  public zoomOutChart$ =  new Subject<void>();
  public zoomToFitChart$ =  new Subject<void>();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
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

  }

  public onResizeEnd(event: ResizeEvent): void {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const newChartWidth = event.rectangle.width > windowWidth ? windowWidth : event.rectangle.width;
    const newChartMaxWidth = Math.max(
      this.minChartWidth,
      Math.round((newChartWidth / windowWidth) * 100)
      );
    const newListMaxWidth = 100 - newChartMaxWidth;

    this.listCardMaxWidth = newListMaxWidth.toString() + '%';
    this.chartCardMaxWidth = newChartMaxWidth.toString() + '%';
  }
  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
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

  public onOpenHelp(url: string): void {
    window.open(url);
  }


  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}