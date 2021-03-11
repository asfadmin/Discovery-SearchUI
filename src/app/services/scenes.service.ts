import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import {
  getAllProducts, getScenes, getTemporalSortDirection,
  getPerpendicularSortDirection,
} from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange, getDateRange,
  getProductTypes, getProjectName, getJobStatuses, getProductNameFilter
} from '@store/filters/filters.reducer';
import { getShowS1RawData, getShowExpiredData } from '@store/ui/ui.reducer';
import { getSearchType } from '@store/search/search.reducer';
import { getHyp3Jobs } from '@store/hyp3/hyp3.reducer';

import {
  CMRProduct, SearchType,
  Range, ColumnSortDirection,
  Hyp3JobWithScene, Hyp3Job, Hyp3JobStatusCode
} from '@models';

@Injectable({
  providedIn: 'root'
})
export class ScenesService {
  constructor(
    private store$: Store<AppState>,
  ) { }

  public products$(): Observable<CMRProduct[]> {
    return (
      this.hideS1Raw$(
      this.hideExpired$(
      this.projectNameFilter$(
      this.jobStatusFilter$(
      this.filterBaselineValues$(
      this.filterByDate$(
        this.store$.select(getAllProducts)
      ))))))
    );
  }

  public scenes$(): Observable<CMRProduct[]> {
    return (
      this.filterByProductName$(
      this.projectNameFilter$(
      this.hideExpired$(
      this.jobStatusFilter$(
      this.hideS1Raw$(
      this.filterBaselineValues$(
      this.filterByDate$(
          this.store$.select(getScenes)
    ))))))));
  }

  public matchHyp3Jobs$(scenes$: Observable<CMRProduct[]>): Observable<Hyp3JobWithScene[]> {
    return combineLatest(
      scenes$,
      this.store$.select(getHyp3Jobs)
    ).pipe(
      map(([scenes, jobs]) => {
        const jobsByName = jobs.reduce((byName, job) => {
          byName[job.job_parameters.granules[0]] = job;
          return byName;
        }, {});

        return scenes.map(scene => {
          return {
            scene,
            job: jobsByName[scene.name]
          };
        });
      })
    );
  }

  public withBrowses$(scenes$: Observable<CMRProduct[]>): Observable<CMRProduct[]> {
    return scenes$.pipe(
      map(scenes => scenes.filter(scene => this.sceneHasBrowse(scene)))
    );
  }

  public sortScenes$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getTemporalSortDirection),
      this.store$.select(getPerpendicularSortDirection)
    ).pipe(
      map(
        ([scenes, tempSort, perpSort]) => {
          if (tempSort === ColumnSortDirection.NONE && perpSort === ColumnSortDirection.NONE) {
            return scenes;
          }

          if (tempSort !== ColumnSortDirection.NONE) {
            return this.temporalSort(scenes, tempSort);
          } else {
            return this.perpendicularSort(scenes, perpSort);
          }
        }
      )
    );
  }

  private hideS1Raw$(products$: Observable<CMRProduct[]>) {
    return combineLatest(
      products$,
      this.store$.select(getShowS1RawData),
      this.store$.select(getProductTypes),
      this.store$.select(getSearchType),
    ).pipe(
      map(([ scenes, showS1RawData, productTypes, searchType ]) => {
        if (showS1RawData) {
          return scenes;
        }

        if (searchType !== SearchType.DATASET) {
          return scenes;
        }

        if (!scenes.every(scene => scene.dataset === 'Sentinel-1B' || scene.dataset === 'Sentinel-1A')) {
          return scenes;
        }

        if (productTypes.length > 0) {
          return scenes;
        }

        return scenes.filter(scene => !scene.productTypeDisplay.includes('RAW'));
      })
    );
  }

  private projectNameFilter$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getProjectName),
      this.store$.select(getSearchType),
    ).pipe(
      map(([scenes, projectName, searchType]) => {
        if (searchType !== SearchType.CUSTOM_PRODUCTS) {
          return scenes;
        }

        if (projectName === null || projectName === '') {
          return scenes;
        }

        return scenes
          .filter(scene => {
            const sceneProjectName = scene.metadata.job.name;

            return (
              !!sceneProjectName &&
              sceneProjectName.toLowerCase() === projectName.toLowerCase()
            );
          });
      })
    );
  }

  private jobStatusFilter$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getJobStatuses),
      this.store$.select(getSearchType),
    ).pipe(
      map(([scenes, jobStatuses, searchType]) => {
        if (searchType !== SearchType.CUSTOM_PRODUCTS) {
          return scenes;
        }

        if (jobStatuses.length === 0) {
          return scenes;
        }

        const statuses = new Set(jobStatuses);

        return scenes
          .filter(scene => {
            const statusCode = scene.metadata.job.status_code;

            return (
              statuses.has(statusCode)
            );
          });
      })
    );
  }

  private hideExpired$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getShowExpiredData),
      this.store$.select(getSearchType),
    ).pipe(
      map(([scenes, showExpiredData, searchType]) => {
        if (searchType !== SearchType.CUSTOM_PRODUCTS) {
          return scenes;
        }

        return scenes.filter(scene => {
          if (showExpiredData) {
            return true;
          }

          if (!this.isExpired(scene.metadata.job)) {
            return true;
          }
        });
      })
    );
  }

  private filterBaselineValues$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getTemporalRange),
      this.store$.select(getPerpendicularRange),
      this.store$.select(getDateRange),
      this.store$.select(getSearchType),
    ).pipe(
      map(([scenes, tempRange, perpRange, dateRange, searchType]) => {
        return (searchType === SearchType.BASELINE) ?
          scenes.filter(scene =>
            this.valInRange(scene.metadata.temporal, tempRange) &&
            this.valInRange(scene.metadata.perpendicular, perpRange) &&
            this.dateInRange(scene.metadata.date, dateRange)
          ) :
          scenes;
      })
    );
  }

  private filterByDate$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest(
      scenes$,
      this.store$.select(getDateRange),
      this.store$.select(getSearchType),
    ).pipe(
      map(
        ([scenes, dateRange, searchType]) => {
          if (searchType !== SearchType.CUSTOM_PRODUCTS) {
            return scenes;
          }

          const range = {
            start: moment(dateRange.start),
            end: moment(dateRange.end)
          };

          if (dateRange.start === null && dateRange.end === null) {
            return scenes;
          }

          return scenes.filter(scene => {
            if (dateRange.start === null && dateRange.end !== null) {
              return scene.metadata.date <= range.end ;
            } else if (dateRange.start !== null && dateRange.end === null) {
              return scene.metadata.date >= range.start ;
            } else {
              return (
                scene.metadata.date >= range.start  &&
                scene.metadata.date <= range.end
              );
            }
          });
        }

      )
    );
  }

  private temporalSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
      (a, b) => a.metadata.temporal - b.metadata.temporal :
      (a, b) => b.metadata.temporal - a.metadata.temporal;

    return scenes.sort(sortFunc);
  }

  private perpendicularSort(scenes, direction: ColumnSortDirection) {
    const sortFunc = (direction === ColumnSortDirection.INCREASING) ?
      (a, b) => a.metadata.perpendicular - b.metadata.perpendicular :
      (a, b) => b.metadata.perpendicular - a.metadata.perpendicular;

    return scenes.sort(sortFunc);
  }

  private valInRange(val: number | null, range: Range<number>): boolean {
    return (
      Number.isNaN(range.start) || range.start === null ||
      Number.isNaN(range.end) || range.end === null ||
      (val >= range.start && val <= range.end)
    );
  }

  private dateInRange(date: moment.Moment, range: Range<Date | null>): boolean {
    return (
      this.after(date, range.start) &&
      this.before(date, range.end)
    );
  }

  private sceneHasBrowse(scene: CMRProduct): boolean {
    return scene.browses.filter(
      browse => !browse.includes('no-browse')
    ).length > 0;
  }

  private after(check: moment.Moment, pivot: Date | null): boolean {
    return (
      pivot === null ||
      check.isAfter(moment.utc(pivot))
    );
  }

  private before(check: moment.Moment, pivot: Date | null): boolean {
    return (
      pivot === null ||
      check.isBefore(moment.utc(pivot))
    );
  }

  public isExpired(job: Hyp3Job): boolean {
    return job.status_code === Hyp3JobStatusCode.SUCCEEDED &&
      this.expirationDays(job.expiration_time) <= 0;
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }

  private filterByProductName$(scenes$: Observable<CMRProduct[]>): Observable<CMRProduct[]> {
    return combineLatest([
      scenes$,
      this.store$.select(getSearchType),
      this.store$.select(getProductNameFilter),
    ]
    ).pipe(
      map(([scenes, searchType, productNameFilter]) => {
        if (searchType === SearchType.CUSTOM_PRODUCTS && !!productNameFilter) {
          let fileIds: string[] = [];

          if (productNameFilter.includes(',')) {
            fileIds = productNameFilter.split(',');
          } else {
            fileIds.push(productNameFilter);
          }

          fileIds = fileIds
            .map(id =>
                id.toLowerCase()
                .trim()
                .split('.')[0]
              )
            .filter(id => id.length > 0);

          return scenes.filter(scene => {
              const fileName = scene.metadata.fileName.toLowerCase().split('.')[0];
              const sourceGranule = scene.name.toLowerCase();

              return fileIds.some(id => fileName.includes(id) || sourceGranule.includes(id)) 
              || fileIds.includes(fileName) 
              || fileIds.includes(sourceGranule) 
              || fileIds.includes(scene.id)
            }
          );
        }

        return scenes;
      }
      )
    );
  }
}
