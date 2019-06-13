import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Dataset, DateRangeExtrema, DateExtrema } from '@models';

@Injectable({
  providedIn: 'root'
})
export class DateExtremaService {

  public getExtrema$(
    datasets$,
    selectedDataset$,
    startDate$,
    endDate$,
  ) {

    const startMin$ = this.startMin$(
      datasets$,
      selectedDataset$
    );

    const startMax$ = this.startMax$(
      datasets$,
      selectedDataset$,
      endDate$
    );

    const endMin$ = this.endMin$(
      datasets$,
      selectedDataset$,
      startDate$
    );

    const endMax$ = this.endMax$(
      datasets$,
      selectedDataset$,
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
        })
      )
    );
  }

  private startMin$(
    datasets$: Observable<Dataset[]>,
    selectedDataset$: Observable<Dataset>
  ): Observable<Date> {
    return combineLatest(
      datasets$,
      selectedDataset$
    ).pipe(
      map(([datasets, selected]) => {
        return selected.date.start;
      })
    );
  }

  private startMax$(
    datasets$: Observable<Dataset[]>,
    selectedDataset$: Observable<Dataset>,
    endDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDataset$,
      endDate$
    ).pipe(
      map(([datasets, selected, userEnd]) => {
        if (!!userEnd) {
          return userEnd;
        }

        return selected.date.end || new Date(Date.now());
      })
    );

  }

  private endMin$(
    datasets$: Observable<Dataset[]>,
    selectedDataset$: Observable<Dataset> ,
    startDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDataset$,
      startDate$
    ).pipe(
      map(([datasets, selected, userStart]) => {
        if (!!userStart) {
          return userStart;
        }

        return selected.date.start;
      })
    );
  }

  private endMax$(
    datasets$: Observable<Dataset[]>,
    selectedDataset$: Observable<Dataset>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDataset$
    ).pipe(
      map(([datasets, selected]) => {
        return selected.date.end || new Date(Date.now());
      })
    );
  }

  private oldest = (d1: Date, d2: Date): Date => d1 < d2 ? d1 : d2;
  private youngest = (d1: Date, d2: Date): Date => d1 > d2 ? d1 : d2;
}
