import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Store } from '@ngrx/store';
import { NotificationService, SarviewsEventsService, ScenesService } from '@services';
import { AppState } from '@store';

import * as filterStore from '@store/filters';
import { getIsResultsMenuOpen } from '@store/ui';
import { combineLatest } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-sarviews-event-search-selector',
  templateUrl: './sarviews-event-search-selector.component.html',
  styleUrls: ['./sarviews-event-search-selector.component.scss']
})
export class SarviewsEventSearchSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('eventsQueryForm') public eventsQueryForm: NgForm;

  public filteredEvents$ = combineLatest([
    this.sceneService.sarviewsEvents$(),
    this.sceneService.filterSarviewsEventsByName$(this.eventService.getSarviewsEvents$())
  ]).pipe(
    map(([filteredEvents, allEvents]) => ({filteredEvents, allEvents})),
    withLatestFrom(this.store$.select(getIsResultsMenuOpen)),
    map(([events, resultsOpen]) => resultsOpen ? events.filteredEvents : events.allEvents)
  );

  public eventQuery = '';

  private subs = new SubSink();

  constructor(private store$: Store<AppState>,
              private sceneService: ScenesService,
              private eventService: SarviewsEventsService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filterStore.getSarviewsEventNameFilter).subscribe(
        nameFilter => this.eventQuery = nameFilter
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  public onMatAutoCompleteSelect(event: MatAutocompleteSelectedEvent) {
    const eventDescription = event.option.value;
    this.store$.dispatch(new filterStore.SetSarviewsEventNameFilter(eventDescription));
  }

  public onSearchQueryChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    if (query.length > 100) {
      this.notificationService.error('Event Search Filter Too Long');
    } else {
      this.store$.dispatch(new filterStore.SetSarviewsEventNameFilter(query));
    }
  }
}
