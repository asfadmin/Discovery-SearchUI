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
    selectedDatasets$,
    startDate$,
    endDate$,
  ) {

    const startMin$ = this.startMin$(
      datasets$,
      selectedDatasets$
    );

    const startMax$ = this.startMax$(
      datasets$,
      selectedDatasets$,
      endDate$
    );

    const endMin$ = this.endMin$(
      datasets$,
      selectedDatasets$,
      startDate$
    );

    const endMax$ = this.endMax$(
      datasets$,
      selectedDatasets$,
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
    selectedDatasets$: Observable<Dataset[]>
  ): Observable<Date> {
    return combineLatest(
      datasets$,
      selectedDatasets$
    ).pipe(
      map(([datasets, selected]) => {
        const dates = selected.length > 0 ?
          selected :
          datasets;

        return dates
          .map(dataset => dataset.date.start)
          .reduce(this.oldest);
      })
    );
  }

  private startMax$(
    datasets$: Observable<Dataset[]>,
    selectedDatasets$: Observable<Dataset[]>,
    endDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDatasets$,
      endDate$
    ).pipe(
      map(([datasets, selected, userEnd]) => {
        if (!!userEnd) {
          return userEnd;
        }

        const dates = selected.length > 0 ?
          selected :
          datasets;

        const max = dates
          .map(dataset => dataset.date.end || new Date(Date.now()))
          .reduce(this.youngest);

        return max;
      })
    );

  }

  private endMin$(
    datasets$: Observable<Dataset[]>,
    selectedDatasets$: Observable<Dataset[]> ,
    startDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDatasets$,
      startDate$
    ).pipe(
      map(([datasets, selected, userStart]) => {
        if (!!userStart) {
          return userStart;
        }

        const dates = selected.length > 0 ?
          selected :
          datasets;

        const min = dates
          .map(dataset => dataset.date.start)
          .reduce(this.oldest);

        return min;
      })
    );
  }

  private endMax$(
    datasets$: Observable<Dataset[]>,
    selectedDatasets$: Observable<Dataset[]>
  ): Observable<Date> {

    return combineLatest(
      datasets$,
      selectedDatasets$
    ).pipe(
      map(([datasets, selected]) => {
        const dates = selected.length > 0 ?
          selected :
          datasets;

        const max = dates
          .map(dataset => dataset.date.end || new Date(Date.now()))
          .reduce(this.youngest);

        return max;
      })
    );
  }

  private oldest = (d1: Date, d2: Date): Date => d1 < d2 ? d1 : d2;
  private youngest = (d1: Date, d2: Date): Date => d1 > d2 ? d1 : d2;
}
