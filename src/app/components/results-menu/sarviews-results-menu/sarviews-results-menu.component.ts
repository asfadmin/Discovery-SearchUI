import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import { ScenesService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import * as models from '@models';
import { withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-sarviews-results-menu',
  templateUrl: './sarviews-results-menu.component.html',
  styleUrls: ['./sarviews-results-menu.component.scss', '../results-menu.component.scss']
})
export class SarviewsResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public selectedProducts$ = this.store$.select(scenesStore.getSelectedSceneProducts);
  public scenesLength;
  public sarviewsEventsLength;
  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public sarviewsEvents$ = this.store$.select(scenesStore.getSarviewsEvents);

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private scenesService: ScenesService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );
    this.subs.add(
      this.scenesService.scenes$().subscribe(
        scenes => this.scenesLength = scenes.length
      )
    );
    this.subs.add(
      this.sarviewsEvents$.subscribe(
        events => this.sarviewsEventsLength = events.length
      )
    );
    this.subs.add(
      this.store$.select(scenesStore.getSelectedSarviewsEvent).pipe(
        withLatestFrom(this.sarviewsEvents$),
      ).subscribe(
        ([selected, events]) => {
          if (selected == null && !!events) {
            this.store$.dispatch(new scenesStore.SetSelectedSarviewsEvent(events[0]?.event_id));
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
