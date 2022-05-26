import { Component, OnInit, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


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

  public onToggleSeasonalOptions(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.store$.dispatch(new filtersStore.ClearSeason());
    } else {
      this.store$.dispatch(new filtersStore.SetSeasonStart(1));
      this.store$.dispatch(new filtersStore.SetSeasonEnd(180));
    }
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
    let value = (which === 'start') ? this.start : this.end;
    value += amount;
    value = value < 1 ? 365 + value : value;
    value = value > 365 ? value % 365 : value;

    if (which === 'start') {
      this.store$.dispatch(new filtersStore.SetSeasonStart(value));
    } else {
      this.store$.dispatch(new filtersStore.SetSeasonEnd(value));
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
