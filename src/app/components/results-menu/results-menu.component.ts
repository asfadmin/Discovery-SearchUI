import { Component, HostListener, OnInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { map, withLatestFrom, filter, tap } from 'rxjs/operators';
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
// import { Breakpoints } from '@models';

@Component({
  selector: 'app-results-menu',
  templateUrl: './results-menu.component.html',
  styleUrls: ['./results-menu.component.scss'],
  animations: [
    trigger('changeMenuY', [
      state('shown', style({ transform: 'translateY(0%)'
      })),
      state('hidden',   style({
        transform: 'translateY(100%) translateY(-36px)'
      })),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ]),
  ],
})
export class ResultsMenuComponent implements OnInit {
  public totalResultCount$ = this.store$.select(searchStore.getTotalResultCount);
  public isResultsMenuOpen$ = this.store$.select(uiStore.getIsResultsMenuOpen);

  public allProducts$ = this.store$.select(scenesStore.getAllProducts);
  public numberOfScenes$ = this.store$.select(scenesStore.getNumberOfScenes);
  public numberOfProducts$ = this.store$.select(scenesStore.getNumberOfProducts);
  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);

  public style: object = {};
  public innerWidth: any;
  public innerHeight: any;

  public areNoScenes$ = this.store$.select(scenesStore.getScenes).pipe(
    map(scenes => scenes.length === 0)
  );

  public isHidden$ = this.store$.select(uiStore.getIsHidden);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private screenSize: ScreenSizeService,
  ) { }

  public onToggleMenu(): void {
    this.store$.dispatch(new uiStore.ToggleResultsMenu());
  }

  public onZoomToResults(): void {
    this.mapService.zoomToResults();
  }

  private selectNextScene(): void {
    this.store$.dispatch(new scenesStore.SelectNextScene());
  }

  private selectPreviousScene(): void {
    this.store$.dispatch(new scenesStore.SelectPreviousScene());
  }

  public validate(event: ResizeEvent): boolean {
    const MIN_DIMENSIONS_PX = 50;
    if (
      event.rectangle.width &&
      event.rectangle.height &&
      (event.rectangle.width < MIN_DIMENSIONS_PX ||
        event.rectangle.height < MIN_DIMENSIONS_PX)
    ) {
      return false;
    }
    return true;
  }

  public onResizeEnd(event: ResizeEvent): void {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    let maxHeight = this.innerHeight - 50;
    maxHeight = event.rectangle.height > maxHeight ?
                  maxHeight : event.rectangle.height;
    this.style = {
      position: 'static',
      left: `${event.rectangle.left}px`,
      top: `${event.rectangle.top}px`,
      bottom: 0,
      width: `100%`,
      height: `${maxHeight}px`,
    };
  }

  private queueAllProducts(products: models.CMRProduct[]): void {
    this.store$.dispatch(new queueStore.AddItems(products));
  }

  public formatNumber(num: number): string {
    return (num || 0)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  @HostListener('window:resize', ['$event'])
  onResize( event ) {
    const resultDiv = document.getElementById('result-div');
    const window_height = window.innerHeight;

    if (resultDiv.offsetHeight < window_height) {
      resultDiv.style.height = '100%';
      const resultDiv_height = resultDiv.offsetHeight;
      resultDiv.style.height = resultDiv_height + 'px';
    } else {}
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
  }

}
