import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ScreenSizeService } from '@services';
import { AppState } from '@store';

import * as models from '@models';
import * as scenesStore from '@store/scenes';

import { SubSink } from 'subsink';
import { NgIf, AsyncPipe } from '@angular/common';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { SearchTypeSelectorComponent } from '../../shared/selectors/search-type-selector/search-type-selector.component';
import { DocsModalComponent } from '../../shared/docs-modal/docs-modal.component';
import { SarviewsEventActiveSelectorComponent } from '../../shared/selectors/sarviews-event-active-selector/sarviews-event-active-selector.component';
import { SarviewsEventSearchSelectorComponent } from '../../shared/selectors/sarviews-event-search-selector/sarviews-event-search-selector.component';
import { SarviewsEventTypeSelectorComponent } from '../../shared/selectors/sarviews-event-type-selector/sarviews-event-type-selector.component';
import { SarviewsEventMagnitudeSelectorComponent } from '../../shared/selectors/sarviews-event-magnitude-selector/sarviews-event-magnitude-selector.component';
import { DateSelectorComponent } from '../../shared/selectors/date-selector/date-selector.component';
import { PathSelectorComponent } from '../../shared/selectors/path-selector/path-selector.component';
import { Hyp3JobTypeSelectorComponent } from '../../shared/selectors/hyp3-job-type-selector/hyp3-job-type-selector.component';
import { TranslateModule } from '@ngx-translate/core';

enum FilterPanel {
  SEARCH = 'Search Options',
  EVENT_DESCRIPTION = 'Event Filter',
  DATE = 'Date',
  TYPE = 'Event Types',
}

@Component({
  selector: 'app-sarviews-filters',
  templateUrl: './sarviews-filters.component.html',
  styleUrls: ['./sarviews-filters.component.scss'],
  imports: [
    NgIf,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    SearchTypeSelectorComponent,
    DocsModalComponent,
    SarviewsEventActiveSelectorComponent,
    SarviewsEventSearchSelectorComponent,
    SarviewsEventTypeSelectorComponent,
    SarviewsEventMagnitudeSelectorComponent,
    DateSelectorComponent,
    PathSelectorComponent,
    Hyp3JobTypeSelectorComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
export class SarviewsFiltersComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
  public areResultsLoaded: boolean;

  selectedPanel: FilterPanel | null = null;
  panels = FilterPanel;
  defaultPanelOpenState = true;
  panelIsDisabled = true;
  customCollapsedHeight = '30px';
  customExpandedHeight = '30px';

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(scenesStore.getAreResultsLoaded)
        .subscribe((areLoaded) => (this.areResultsLoaded = areLoaded)),
    );
  }

  public isSelected(panel: FilterPanel): boolean {
    return this.selectedPanel === panel;
  }

  public selectPanel(panel: FilterPanel): void {
    this.selectedPanel = panel;
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
