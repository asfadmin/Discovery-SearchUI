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
          this.start = start ? start : 1;
          this.end = end ? end : 180;
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
    this.store$.dispatch(new filtersStore.SetSeasonStart(this.start));
    this.store$.dispatch(new filtersStore.SetSeasonEnd(this.end));
  }

  public swap() {
    const temp = this.start;
    const temp2 = this.end;

    this.store$.dispatch(new filtersStore.SetSeasonStart(temp2));
    this.store$.dispatch(new filtersStore.SetSeasonEnd(temp));
  }
  public change(which: string, amount: number) {
    if (which === 'start') {
      this.start += amount;
      // this.store$.dispatch(new filtersStore.SetSeasonStart(this.start + amount));
    } else {
      this.end += amount;
      // this.store$.dispatch(new filtersStore.SetSeasonEnd(this.end + amount));
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
