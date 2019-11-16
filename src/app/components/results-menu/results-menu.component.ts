import { Component, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Subject } from 'rxjs';
import { map, withLatestFrom, filter, tap, pairwise } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from '@services';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';
import * as filtersStore from '@store/filters';
import * as searchStore from '@store/search';

import { MapService } from '@services';
import * as models from '@models';

enum MobileViews {
  LIST = 0,
  DETAIL = 1
}

@Component({
  selector: 'app-results-menu',
  templateUrl: './results-menu.component.html',
  styleUrls: ['./results-menu.component.scss'],
})
export class ResultsMenuComponent implements OnInit {
  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);
  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public menuHeightPx: number;
  public view = MobileViews.LIST;
  public Views = MobileViews;

  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  public isHidden$ = this.store$.select(uiStore.getIsHidden);
  public resize$ = new Subject<void>();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit() {
    this.menuHeightPx = document.documentElement.clientHeight * .5;
  }

  @HostListener('window:resize', ['$event'])
  onResize( event ) {
    const resultDiv = document.getElementById('result-div');
    resultDiv.style.height = `${document.documentElement.clientHeight * 0.5}px`;

    this.resize$.next();
  }

  public onTabChange(e): void {
    this.resize$.next();
  }

  public onSelectList(): void {
    this.view = MobileViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = MobileViews.DETAIL;
  }

  public validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX = 36;
    const { width, height } = event.rectangle;

    return !(
      width && height &&
      (width < MIN_DIMENSIONS_PX || height < MIN_DIMENSIONS_PX)
    );
  }

  public onResizeEnd(event: ResizeEvent): void {
    const maxHeight = window.innerHeight - 100;
    const newHeight = event.rectangle.height;

    this.menuHeightPx = Math.min(newHeight, maxHeight);

    this.resize$.next();
  }

  public onFinalResize() {
    this.resize$.next();
  }
}
