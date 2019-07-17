import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Dataset, DateRangeExtrema, DateExtrema } from '@models';

@Injectable({
  providedIn: 'root'
})
export class DateExtremaService {

  public getExtrema$(
    selectedDataset$: Observable<Dataset>,
    startDate$: Observable<Date | null>,
    endDate$: Observable<Date | null>,
  ) {

    const startMin$ = selectedDataset$.pipe(
        map(selected => selected.date.start)
    );

    const startMax$ = combineLatest(
      selectedDataset$, endDate$
    ).pipe(
      map(([selected, userEnd]) => {
        if (!!userEnd) {
          return (userEnd > selected.date.start) ?
            selected.date.start :
            userEnd;
        }

        return selected.date.end || new Date(Date.now());
      })
    );

    const endMin$ = combineLatest(
      selectedDataset$,
      startDate$
    ).pipe(
      map(([selected, userStart]) => {
        if (!!userStart) {
          return (userStart < selected.date.start) ?
            selected.date.start :
            userStart;
        }

        return selected.date.start;
      })
    );

    const endMax$ = selectedDataset$.pipe(
      map(selected => selected.date.end || new Date(Date.now()))
    );

    return combineLatest(startMin$, startMax$, endMin$, endMax$).pipe(
      map(
        ([startMin, startMax, endMin, endMax]): DateRangeExtrema => ({
          start: {
            min: startMin,
            max: startMax
          },
          end: {
            min: endMin,
            max: endMax
          }
        }
      )
    )
    );
  }
}
