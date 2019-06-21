import { Component, OnInit } from '@angular/core';

import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-season-selector',
  templateUrl: './season-selector.component.html',
  styleUrls: ['./season-selector.component.css']
})
export class SeasonSelectorComponent implements OnInit {
  public isSeasonalSearch = false;

  public start: number;
  public end: number;

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    const seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
    const seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);

    combineLatest(seasonStart$, seasonEnd$).subscribe(
      ([start, end]) => this.isSeasonalSearch = !!(start || end)
    );

    seasonStart$.subscribe(start => this.start = start);
    seasonEnd$.subscribe(end => this.end = end);
  }

  public onToggleSeasonalOptions(): void {
    this.store$.dispatch(new filtersStore.ClearSeason());
  }

  public onSeasonStartChange(dayOfYear: number): void {
    this.store$.dispatch(new filtersStore.SetSeasonStart(dayOfYear));
  }

  public onSeasonEndChange(dayOfYear: number): void {
    this.store$.dispatch(new filtersStore.SetSeasonEnd(dayOfYear));
  }

  public dayOfYearFormat(dayOfYear: number | null, month = 'numeric'): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString('en-US', {
      month, day: 'numeric'
    });
  }

}
