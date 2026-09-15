import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  ViewChild,
  OnDestroy,
  inject,
} from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter, withLatestFrom, tap, switchMap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import * as models from '@models';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import { ScenesService } from '@services';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-browse-list',
  templateUrl: './browse-list.component.html',
  styleUrls: ['./browse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    MatBadge,
    AsyncPipe,
    ShortDatePipe,
  ],
})
export class BrowseListComponent implements OnInit, AfterViewInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private scenesService = inject(ScenesService);

  @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;

  public scenesSorted$ = this.scenesService.sortScenes$(
    this.scenesService.scenes$,
  );
  public scenes$: Observable<models.CMRProduct[]>;
  public selectedId: string;
  public browses$ = this.store$.select(scenesStore.getSelectedSceneBrowses);

  public searchTypes = models.SearchType;

  private selectedFromList = false;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.store$
        .select(uiStore.getOnlyScenesWithBrowse)
        .subscribe(
          (onlyBrowse) =>
            (this.scenes$ = onlyBrowse
              ? this.scenesService.withBrowses$(this.scenesSorted$)
              : this.scenesSorted$),
        ),
    );
  }

  ngAfterViewInit() {
    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedScene)
        .pipe(
          withLatestFrom(
            this.store$
              .select(uiStore.getOnlyScenesWithBrowse)
              .pipe(
                switchMap(
                  (onlyBrowse) =>
                    (this.scenes$ = onlyBrowse
                      ? this.scenesService.withBrowses$(this.scenesSorted$)
                      : this.scenesSorted$),
                ),
              ),
          ),
          filter(([selected, _]) => !!selected),
          tap(([selected, _]) => (this.selectedId = selected.id)),
          map(([selected, scenes]) => scenes.indexOf(selected)),
        )
        .subscribe((idx) => {
          if (!this.selectedFromList) {
            this.scroll.scrollToIndex(idx);
          }

          this.selectedFromList = false;
        }),
    );
  }

  public onNewSceneSelected(scene: models.CMRProduct): void {
    this.selectedFromList = true;
    this.store$.dispatch(new scenesStore.SetSelectedScene(scene.id));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
