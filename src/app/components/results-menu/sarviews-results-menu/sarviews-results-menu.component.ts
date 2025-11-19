import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { SarviewsEventsService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { map } from 'rxjs/operators';
import { OpenFiltersMenu } from '@store/ui';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { NgClass, NgIf, AsyncPipe } from '@angular/common';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { SceneDetailComponent } from '../scene-detail/scene-detail.component';
import { EventProductSortSelectorComponent } from '../../shared/event-product-sort-selector/event-product-sort-selector.component';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import { SceneFilesComponent } from '../scene-files/scene-files.component';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sarviews-results-menu',
  templateUrl: './sarviews-results-menu.component.html',
  styleUrls: [
    './sarviews-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
  imports: [
    MatCard,
    NgClass,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,
    NgIf,
    SceneDetailComponent,
    EventProductSortSelectorComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTooltip,
    MatIcon,
    SceneFilesComponent,
    MatButton,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SarviewsResultsMenuComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  private eventMonitoringService = inject(SarviewsEventsService);

  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(
    scenesStore.getSelectedSceneProducts,
  );
  public selectedEventProducts$ =
    this.eventMonitoringService.filteredEventProducts$();
  public unfilteredEventProductsLength$ = this.store$
    .select(scenesStore.getSelectedSarviewsEventProducts)
    .pipe(map((products) => products.length));
  public sarviewsEventsLength;
  public sarviewsProductsLength;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public sarviewsEvents$ =
    this.eventMonitoringService.filteredSarviewsEvents$();

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (breakpoint) => (this.breakpoint = breakpoint),
      ),
    );
    this.subs.add(
      this.sarviewsEvents$.subscribe((events) => {
        this.sarviewsEventsLength = events.length;

        if (this.sarviewsEventsLength === 0) {
          this.sarviewsProductsLength = 0;
        }
      }),
    );
    this.subs.add(
      combineLatest([
        this.store$.select(scenesStore.getSelectedSarviewsEvent),
        this.sarviewsEvents$,
      ]).subscribe(([selected, events]) => {
        if (selected == null && !!events) {
          this.store$.dispatch(
            new scenesStore.SetSelectedSarviewsEvent(events[0]?.event_id),
          );
        } else if (
          !events?.map((ev) => ev.event_id)?.includes(selected.event_id)
        ) {
          this.store$.dispatch(
            new scenesStore.SetSelectedSarviewsEvent(events[0]?.event_id),
          );
        }
      }),
    );
    this.subs.add(
      this.selectedEventProducts$.subscribe(
        (events) => (this.sarviewsProductsLength = events.length),
      ),
    );
  }

  public onOpenFiltersPanel() {
    this.store$.dispatch(new OpenFiltersMenu());
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
