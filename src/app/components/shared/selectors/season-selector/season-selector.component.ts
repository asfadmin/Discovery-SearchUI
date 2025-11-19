import { Component, OnInit, OnDestroy, inject } from '@angular/core';

import { combineLatest, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import {
  MatSlideToggleChange,
  MatSlideToggle,
} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CircleSliderComponent } from '../circle-slider/circle-slider.component';
import { MatButton } from '@angular/material/button';
import { ShortDateSeasonPipe } from '../../../../pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-season-selector',
  templateUrl: './season-selector.component.html',
  styleUrls: ['./season-selector.component.scss'],
  imports: [
    MatSlideToggle,
    FormsModule,
    NgIf,
    CircleSliderComponent,
    MatButton,
    ShortDateSeasonPipe,
    TranslateModule,
  ],
})
export class SeasonSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public isSeasonalSearch = false;

  public start: number;
  public end: number;
  private subs = new SubSink();
  private endDate$ = new Subject<number>();
  private startDate$ = new Subject<number>();

  ngOnInit() {
    const seasonStart$ = this.store$.select(filtersStore.getSeasonStart);
    const seasonEnd$ = this.store$.select(filtersStore.getSeasonEnd);

    this.subs.add(
      combineLatest(seasonStart$, seasonEnd$)
        .pipe(
          tap(([start, end]) => {
            this.start = start;
            this.end = end;
          }),
        )
        .subscribe(
          ([start, end]) => (this.isSeasonalSearch = !!(start || end)),
        ),
    );
    this.subs.add(
      this.startDate$.pipe(debounceTime(500)).subscribe((startDate) => {
        const action = new filtersStore.SetSeasonStart(startDate);
        this.store$.dispatch(action);
      }),
    );
    this.subs.add(
      this.endDate$.pipe(debounceTime(500)).subscribe((endDate) => {
        const action = new filtersStore.SetSeasonEnd(endDate);
        this.store$.dispatch(action);
      }),
    );
  }

  public onToggleSeasonalOptions(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.store$.dispatch(new filtersStore.ClearSeason());
    } else {
      // Batch dispatch to reduce lag from multiple state updates
      setTimeout(() => {
        this.store$.dispatch(new filtersStore.SetSeasonStart(1));
        this.store$.dispatch(new filtersStore.SetSeasonEnd(180));
      }, 0);
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
    let value = which === 'start' ? this.start : this.end;
    value += amount;
    value = value < 1 ? 365 + value : value;
    value = value > 365 ? value % 365 : value;

    if (which === 'start') {
      this.start = value;
      this.startDate$.next(value);
    } else {
      this.end = value;
      this.endDate$.next(value);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
