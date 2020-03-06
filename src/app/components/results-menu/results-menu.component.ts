import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { SubSink } from 'subsink';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from '@services';

import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as scenesStore from '@store/scenes';

import { MapService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-results-menu',
  templateUrl: './results-menu.component.html',
  styleUrls: ['./results-menu.component.scss'],
})
export class ResultsMenuComponent implements OnInit, OnDestroy {
  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);
  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public menuHeightPx: number;

  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  public resize$ = new Subject<void>();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public isUnzipOpen: boolean;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit() {
    this.menuHeightPx = this.defaultMenuHeight();

    this.subs.add(
      this.store$.select(scenesStore.getShowUnzippedProduct).subscribe(
        showUnzippedProduct => this.isUnzipOpen = showUnzippedProduct
      )
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize( event ) {
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

  public onTabChange(e): void {
    this.resize$.next();
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
