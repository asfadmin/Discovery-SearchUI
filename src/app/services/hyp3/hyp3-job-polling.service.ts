import { Injectable } from '@angular/core';

import {
  Observable, combineLatest, debounceTime, filter,
  switchMap, forkJoin, of, repeat, map
} from 'rxjs';

import { Hyp3ApiService } from './hyp3-api.service';
import * as models from '@models';

@Injectable({
  providedIn: 'root'
})
export class Hyp3JobPollingService {
  pollingRepeatTime = 60000; // one minute

  constructor(private hyp3: Hyp3ApiService) { }

  public pollHyp3Jobs$(
    searchType$: Observable<models.SearchType>,
    scenes$: Observable<models.CMRProduct[]>,
    userId$: Observable<string>
  ) {
    const inProgressScenes$ = scenes$.pipe(
      map(scenes => scenes.filter(scene =>
        scene.metadata?.job?.status_code === models.Hyp3JobStatusCode.RUNNING ||
        scene.metadata?.job?.status_code === models.Hyp3JobStatusCode.PENDING
      ))
    );

    const pollRunningJobs$ = combineLatest([
      searchType$, inProgressScenes$, userId$
    ]).pipe(
      debounceTime(50),
      filter(([searchType, inProgress, __]) =>
        searchType === models.SearchType.CUSTOM_PRODUCTS &&
        inProgress.length > 0
      ),
      switchMap(([_, inProgressScenes, hyp3UserId]) => {
        return forkJoin([
          this.hyp3.getJobs$({
            userID: hyp3UserId, statusCode: models.Hyp3JobStatusCode.PENDING
          }),
          this.hyp3.getJobs$({
            userID: hyp3UserId, statusCode: models.Hyp3JobStatusCode.RUNNING
          }),
          of({ inProgressScenes, hyp3UserId })
        ]).pipe(
          repeat({ delay: this.pollingRepeatTime }),
          filter(([__, ___, oldRunningJobs]) => oldRunningJobs.hyp3UserId === hyp3UserId),
          map(([pending, running, oldRunningJobs]) => {
            return oldRunningJobs.inProgressScenes.length - (running.hyp3Jobs.length + pending.hyp3Jobs.length);
          })
        );
      })
    );

    return pollRunningJobs$;
  }
}
