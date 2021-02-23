import { Injectable } from '@angular/core';

import { Observable, combineLatest} from 'rxjs';
import {map, reduce } from 'rxjs/operators';

import * as moment from 'moment';

import { Dataset, DateRangeExtrema, CMRProduct, CMRProductPair } from '@models';

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
    ),
    // tap(output => console.log(output))
    );
  }

  public getSbasExtrema$(
    scenes$: Observable<{
      custom: CMRProductPair[];
      pairs: CMRProductPair[];
  }>,
    startDate$: Observable<Date | null>,
    endDate$: Observable<Date | null>,
  ) {
    const sceneMin$ = scenes$.pipe(
      map(value => value.pairs),
      reduce((flattened: CMRProduct[], pair) => flattened.concat(pair[0], pair[1]), []),
      map(scenes => moment.min(scenes.map(scene => scene.metadata.date))),
      map(sceneMin => moment.utc(sceneMin).toDate())
      // tap(sceneMin => console.log(`Scene Min ${sceneMin}`))
    );

    const sceneMax$ = scenes$.pipe(
      map(x => x.pairs),
      reduce((flattened: CMRProduct[], pair) => flattened.concat(pair[0], pair[1]), []),
      map(scenes => moment.max(scenes.map(scene => scene.metadata.date))),
      map(sceneMax => moment.utc(sceneMax).toDate())
      // tap(sceneMax => console.log(`Scene Max ${sceneMax}`))
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
      map(
        ([startMin, startMax, endMin, endMax]): DateRangeExtrema => {

          return ({
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
        }
    )
    );
  }
}
