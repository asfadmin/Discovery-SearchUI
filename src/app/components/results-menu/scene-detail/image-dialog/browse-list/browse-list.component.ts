import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { map, filter, withLatestFrom, tap, switchMap } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import * as models from '@models';
import { ScenesService } from '@services';

@Component({
  selector: 'app-browse-list',
  templateUrl: './browse-list.component.html',
  styleUrls: ['./browse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BrowseListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;

  public scenesSorted$ = this.scenesService.sortScenes$(
    this.scenesService.scenes$()
  );
  public scenes$: Observable<models.CMRProduct[]>;
  public selectedId: string;
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);
  public sarviewsProducts$ = this.store$.select(scenesStore.getSelectedSarviewsEventProducts);
  public sarviewsProducts: models.SarviewsProduct[] = [];
  public selectedProductId: string;

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = models.SearchType;

  private selectedFromList = false;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(uiStore.getOnlyScenesWithBrowse).subscribe(
        onlyBrowse => this.scenes$ = onlyBrowse ?
          this.scenesService.withBrowses$(this.scenesSorted$) :
          this.scenesSorted$
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedScene).subscribe(
        scene => this.selectedId = scene ? scene.id : null
      )
    );

    this.subs.add(
      this.store$.select(scenesStore.getSelectedSarviewsProduct).subscribe(
        product => this.selectedProductId = !!product ? product.product_id : null
      )
    )

  }

  ngAfterViewInit() {
    this.subs.add(
      this.store$.select(scenesStore.getSelectedScene).pipe(
        withLatestFrom(this.store$.select(uiStore.getOnlyScenesWithBrowse).pipe(
          switchMap(
            onlyBrowse => this.scenes$ = onlyBrowse ?
              this.scenesService.withBrowses$(this.scenesSorted$) :
              this.scenesSorted$
          )
        )),
        filter(([selected, _]) => !!selected),
        tap(([selected, _]) => this.selectedId = selected.id),
        map(([selected, scenes]) => scenes.indexOf(selected)),
      ).subscribe(
        idx => {
          if (!this.selectedFromList) {
            this.scroll.scrollToIndex(idx);
          }

          this.selectedFromList = false;
        }
      )
    );

    this.subs.add(
      this.sarviewsProducts$.subscribe(
        sarviewsProducts => this.sarviewsProducts = sarviewsProducts
      )
    );
  }

  public onNewSceneSelected(scene: models.CMRProduct): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(scene.id));
  }

  public onNewProductSelected(product: models.SarviewsProduct): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.setSelectedSarviewProduct(product));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
