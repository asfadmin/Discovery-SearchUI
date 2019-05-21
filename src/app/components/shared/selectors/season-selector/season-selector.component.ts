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

  public seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
  public seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    combineLatest(this.seasonStart$, this.seasonEnd$).subscribe(
      ([start, end]) => this.isSeasonalSearch = !!(start || end)
    );
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

  public dayOfYearFormat(dayOfYear: number | null): string {
    const date = new Date();
    date.setFullYear(2019);

    date.setMonth(0);
    date.setDate(0);
    const timeOfFirst = date.getTime(); // this is the time in milliseconds of 1/1/YYYY
    const dayMilli = 1000 * 60 * 60 * 24;
    const dayNumMilli = dayOfYear * dayMilli;
    date.setTime(timeOfFirst + dayNumMilli);

    return  date.toLocaleDateString('en-US', {
      month: 'numeric', day: 'numeric'
    });
  }

}
