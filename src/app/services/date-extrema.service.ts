import { Injectable } from '@angular/core';

import { Observable, combineLatest} from 'rxjs';
import {filter, map } from 'rxjs/operators';

import * as moment from 'moment';

import { Dataset, CMRProduct, SarviewsEvent, Range } from '@models';

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
          return userEnd;
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
          return userStart;
        }

        return selected.date.start;
      })
    );

    const endMax$ = selectedDataset$.pipe(
      map(selected => selected.date.end || new Date(Date.now()))
    );

    return combineLatest(startMin$, startMax$, endMin$, endMax$).pipe(
      map(extrema => this.buildExtrema(...extrema)),
    );
  }

  public getBaselineExtrema$(
    scenes$: Observable<CMRProduct[]>,
    startDate$: Observable<Date | null>,
    endDate$: Observable<Date | null>,
  ) {
    const sceneMin$ = scenes$.pipe(
      map(scenes => moment.min(scenes.map(scene => scene.metadata.date))),
      map(sceneMin => moment.utc(sceneMin).toDate())
    );

    const sceneMax$ = scenes$.pipe(
      map(scenes => moment.max(scenes.map(scene => scene.metadata.date))),
      map(sceneMax => moment.utc(sceneMax).toDate())
    );

    const startMin$ = sceneMin$;

    const startMax$ = combineLatest(
      sceneMax$, endDate$
    ).pipe(
      map(([sceneMax, userEnd]) => {
        if (!!userEnd) {
          return userEnd;
        }

        return sceneMax || new Date(Date.now());
      })
    );

    const endMin$ = combineLatest(
      sceneMin$,
      startDate$
    ).pipe(
      map(([sceneMin, userStart]) => {
        if (!!userStart) {
          return userStart;
        }

        return sceneMin;
      })
    );

    const endMax$ = sceneMax$;

    return combineLatest(startMin$, startMax$, endMin$, endMax$).pipe(
      map(extrema => this.buildExtrema(...extrema)),
    );
  }

  public getSarviewsExtrema$(events$: Observable<SarviewsEvent[]>) {
    return events$.pipe(
      filter(events => !!events),
      filter(events => events.length > 0),
      map(events => events.map(event => event.processing_timeframe)),
      map(eventsDateRange => {
        const min = eventsDateRange.map(eventRange => eventRange.start)
          .reduce((prev, curr) => prev <= curr ? prev : curr);
        const max = eventsDateRange.map(eventRange => eventRange.end)
        .reduce((prev, curr) => prev > curr ? prev : curr);
        const extrema: Range<Date> = {start: min, end: max};
        return extrema;
      })
    );
  }

  private buildExtrema(startMin, startMax, endMin, endMax) {
    const extrema = {
      start: {
        min: startMin,
        max: startMax
      },
      end: {
        min: endMin,
        max: endMax
      }
    };

    return extrema;
  }
}
