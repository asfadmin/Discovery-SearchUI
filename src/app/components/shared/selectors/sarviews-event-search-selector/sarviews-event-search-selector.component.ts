import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { AsfLanguageService, NotificationService, SarviewsEventsService } from '@services';
import { AppState } from '@store';

import * as filterStore from '@store/filters';
import { getSarviewsEvents } from '@store/scenes';
import { getIsResultsMenuOpen } from '@store/ui';
import { combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { MatFormField, MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-sarviews-event-search-selector',
  templateUrl: './sarviews-event-search-selector.component.html',
  styleUrls: ['./sarviews-event-search-selector.component.scss'],
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatAutocompleteTrigger,
    MatAutocomplete,

    MatOption,
    MatTooltip,

    AsyncPipe,
    ShortDatePipe,
    TranslateModule,
  ],
})
export class SarviewsEventSearchSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private eventService = inject(SarviewsEventsService);
  private notificationService = inject(NotificationService);
  private language = inject(AsfLanguageService);

  @ViewChild('eventsQueryForm') public eventsQueryForm: NgForm;

  public filteredEvents$ = combineLatest([
    this.eventService.filteredSarviewsEvents$(),
    this.eventService.filterSarviewsEventsByName$(
      this.store$.select(getSarviewsEvents),
    ),
  ]).pipe(
    map(([filteredEvents, allEvents]) => ({ filteredEvents, allEvents })),
    withLatestFrom(this.store$.select(getIsResultsMenuOpen)),
    map(([events, resultsOpen]) =>
      resultsOpen ? events.filteredEvents : events.allEvents,
    ),
  );

  public eventQuery = '';

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$
        .select(filterStore.getSarviewsEventNameFilter)
        .subscribe((nameFilter) => (this.eventQuery = nameFilter)),
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onMatAutoCompleteSelect(event: MatAutocompleteSelectedEvent) {
    const eventDescription = event.option.value;
    this.store$.dispatch(
      new filterStore.SetSarviewsEventNameFilter(eventDescription),
    );
  }

  public onSearchQueryChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 100) {
      this.notificationService.error(this.language.translate.instant('EVENT_SEARCH_FILTER_TOO_LONG'));
    } else {
      this.store$.dispatch(new filterStore.SetSarviewsEventNameFilter(query));
    }
  }
}
