import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Platform } from '@models';

@Injectable({
  providedIn: 'root'
})
export class DateExtremaService {

  public getExtrema$(
    platforms$,
    selectedPlatforms$,
    startDate$,
    endDate$,
  ) {

    const startMin$ = this.startMin$(
      platforms$,
      selectedPlatforms$
    );

    const startMax$ = this.startMax$(
      platforms$,
      selectedPlatforms$,
      endDate$
    );

    const endMin$ = this.endMin$(
      platforms$,
      selectedPlatforms$,
      startDate$
    );

    const endMax$ = this.endMax$(
      platforms$,
      selectedPlatforms$,
    );

    return [
      startMin$, startMax$, endMin$, endMax$
    ];
  }

  private startMin$(
    platforms$: Observable<Platform[]>,
    selectedPlatforms$: Observable<Platform[]>
  ): Observable<Date> {
    return combineLatest(
      platforms$,
      selectedPlatforms$
    ).pipe(
      map(([platforms, selected]) => {
        const dates = selected.length > 0 ?
          selected :
          platforms;

        return dates
          .map(platform => platform.date.start)
          .reduce(this.oldest);
      })
    );
  }

  private startMax$(
    platforms$: Observable<Platform[]>,
    selectedPlatforms$: Observable<Platform[]>,
    endDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      platforms$,
      selectedPlatforms$,
      endDate$
    ).pipe(
      map(([platforms, selected, userEnd]) => {
        if (!!userEnd) {
          return userEnd;
        }

        const dates = selected.length > 0 ?
          selected :
          platforms;

        const max = dates
          .map(platform => platform.date.end || new Date(Date.now()))
          .reduce(this.youngest);

        return max;
      })
    );

  }

  private endMin$(
    platforms$: Observable<Platform[]>,
    selectedPlatforms$: Observable<Platform[]> ,
    startDate$: Observable<Date>
  ): Observable<Date> {

    return combineLatest(
      platforms$,
      selectedPlatforms$,
      startDate$
    ).pipe(
      map(([platforms, selected, userStart]) => {
        if (!!userStart) {
          return userStart;
        }

        const dates = selected.length > 0 ?
          selected :
          platforms;

        const min = dates
          .map(platform => platform.date.start)
          .reduce(this.oldest);

        return min;
      })
    );
  }

  private endMax$(
    platforms$: Observable<Platform[]>,
    selectedPlatforms$: Observable<Platform[]>
  ): Observable<Date> {

    return combineLatest(
      platforms$,
      selectedPlatforms$
    ).pipe(
      map(([platforms, selected]) => {
        const dates = selected.length > 0 ?
          selected :
          platforms;

        const max = dates
          .map(platform => platform.date.end || new Date(Date.now()))
          .reduce(this.youngest);

        return max;
      })
    );
  }

  private oldest = (d1: Date, d2: Date): Date => d1 < d2 ? d1 : d2;
  private youngest = (d1: Date, d2: Date): Date => d1 > d2 ? d1 : d2;
}
