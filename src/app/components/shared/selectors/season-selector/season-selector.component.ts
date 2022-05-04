import { Component, OnInit, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';


@Component({
  selector: 'app-season-selector',
  templateUrl: './season-selector.component.html',
  styleUrls: ['./season-selector.component.scss']
})
export class SeasonSelectorComponent implements OnInit, OnDestroy {
  public isSeasonalSearch = false;

  public start: number;
  public end: number;
  private subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    const seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
    const seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);

    this.subs.add(
      combineLatest(seasonStart$, seasonEnd$).pipe(
        tap(([start, end]) => {
          this.start = start;
          this.end = end;
        })
      ).subscribe(
        ([start, end]) => this.isSeasonalSearch = !!(start || end)
      )
    );
  }

  public onToggleSeasonalOptions(): void {
    this.store$.dispatch(new filtersStore.ClearSeason());
  }

  public onSeasonStartChange(dayOfYear: number): void {
    this.start = dayOfYear;
  }

  public onSeasonEndChange(dayOfYear: number): void {
    this.end = dayOfYear;
  }
  public onSeasonDoneSelecting() {
    this.store$.dispatch(new filtersStore.SetSeasonEnd(this.end));
    this.store$.dispatch(new filtersStore.SetSeasonStart(this.start));
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
      month: <'numeric'>month, day: 'numeric'
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
