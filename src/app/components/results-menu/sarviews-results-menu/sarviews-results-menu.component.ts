import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { SarviewsEventsService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';

@Component({
  selector: 'app-sarviews-results-menu',
  templateUrl: './sarviews-results-menu.component.html',
  styleUrls: ['./sarviews-results-menu.component.scss', '../results-menu.component.scss']
})
export class SarviewsResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public selectedEventProducts$ = this.store$.select(scenesStore.getSelectedSarviewsEventProducts);
  public sarviewsEventsLength;
  public sarviewsProductsLength;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public sarviewsEvents$ = this.eventMonitoringService.filteredSarviewsEvents$();

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private eventMonitoringService: SarviewsEventsService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
    this.subs.add(
      this.sarviewsEvents$.subscribe(
        events => {
          this.sarviewsEventsLength = events.length;

          if (this.sarviewsEventsLength === 0) {
            this.sarviewsProductsLength = 0;
          }
        }
      )
    );
    this.subs.add(
      combineLatest(
        [
          this.store$.select(scenesStore.getSelectedSarviewsEvent),
          this.sarviewsEvents$
        ]
      ).subscribe(
        ([selected, events]) => {
          if (selected == null && !!events) {
            this.store$.dispatch(new scenesStore.SetSelectedSarviewsEvent(events[0]?.event_id));
          } else if (!events?.includes(selected)) {
            this.store$.dispatch(new scenesStore.SetSelectedSarviewsEvent(events[0]?.event_id));
          }
        }
      )
    );
    this.subs.add(
      this.selectedEventProducts$.subscribe(
        events => this.sarviewsProductsLength = events.length
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
