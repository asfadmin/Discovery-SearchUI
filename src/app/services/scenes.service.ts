import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import moment from 'moment';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';
import {
  getAllProducts, getScenes, getTemporalSortDirection,
  getPerpendicularSortDirection,
} from '@store/scenes/scenes.reducer';
import {
  getTemporalRange, getPerpendicularRange, getDateRange,
  getProductTypes, getProjectName, getJobStatuses,
  getProductNameFilter, getSeason
} from '@store/filters/filters.reducer';
import { getShowS1RawData, getShowExpiredData } from '@store/ui/ui.reducer';
import { getSearchType } from '@store/search/search.reducer';

import {
  CMRProduct, SearchType,
  Range, ColumnSortDirection,
  Hyp3Job, Hyp3JobStatusCode
} from '@models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ScenesService {
  constructor(
    private store$: Store<AppState>,
    private notificationService: NotificationService,
  ) { }

  public products$(): Observable<CMRProduct[]> {
    return (
      this.hideS1Raw$(
      this.hideExpired$(
      this.projectNameFilter$(
      this.jobStatusFilter$(
      this.filterBaselineValues$(
      this.filterByDate$(
      this.filterBurstSubproducts$(
        this.store$.select(getAllProducts)
      )))))))
    );
  }

  public scenes$: Observable<CMRProduct[]> = this.filterByProductName$(
      this.projectNameFilter$(
      this.hideExpired$(
      this.jobStatusFilter$(
      this.hideS1Raw$(
      this.filterBaselineValues$(
      this.filterByDate$(
      this.filterBurstSubproducts$(
          this.store$.select(getScenes)
    ))))))));

  public withBrowses$(scenes$: Observable<CMRProduct[]>): Observable<CMRProduct[]> {
    return scenes$.pipe(
      map(scenes => scenes.filter(scene => this.sceneHasBrowse(scene)))
    );
  }

  public sortScenes$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest([
      scenes$,
      this.store$.select(getTemporalSortDirection),
      this.store$.select(getPerpendicularSortDirection)]
    ).pipe(
      debounceTime(50),
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
    return combineLatest([
      products$,
      this.store$.select(getShowS1RawData),
      this.store$.select(getProductTypes),
      this.store$.select(getSearchType),]
    ).pipe(
      debounceTime(0),
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

        const filteredScenes = scenes.filter(scene => !scene.productTypeDisplay.includes('RAW'));

        if (filteredScenes.length === 0 && scenes.length > 0) {
          this.notificationService.rawDataHidden();
        }
        return filteredScenes;
      })
    );
  }

  private projectNameFilter$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest([
      scenes$,
      this.store$.select(getProjectName),
      this.store$.select(getSearchType),]
    ).pipe(
      debounceTime(0),
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
    return combineLatest([
      scenes$,
      this.store$.select(getJobStatuses),
      this.store$.select(getSearchType),]
    ).pipe(
      debounceTime(0),
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
            const job = scene.metadata.job;
            if(!!job) {
              const statusCode = job.status_code;
              return statuses.has(statusCode)
            }
            return false;
          });
      })
    );
  }

  private filterBurstSubproducts$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest([
        scenes$,
        this.store$.select(getSearchType)
      ]).pipe(
        map(([scenes, searchtype]) => {
          if (searchtype === SearchType.CUSTOM_PRODUCTS) {
            return scenes.filter(scene => scene.productTypeDisplay !== 'XML Metadata (BURST)');
          }
          return scenes;
        })
      )
  }
  private hideExpired$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest([
      scenes$,
      this.store$.select(getShowExpiredData),
      this.store$.select(getSearchType),]
    ).pipe(
      debounceTime(200),
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
    return combineLatest([
      scenes$,
      this.store$.select(getTemporalRange),
      this.store$.select(getPerpendicularRange),
      this.store$.select(getDateRange),
      this.store$.select(getSearchType),
      this.store$.select(getSeason),]
    ).pipe(
      debounceTime(20),
      map(([scenes, tempRange, perpRange, dateRange, searchType, season]) => {
        return (searchType === SearchType.BASELINE) ?
          scenes.filter(scene =>
            this.valInRange(scene.metadata.temporal, tempRange) &&
            this.valInRange(scene.metadata.perpendicular, perpRange) &&
            this.dateInRange(scene.metadata.date, dateRange) &&
            this.dayInSeason(scene.metadata.date, scene.metadata.stopDate, season)
          ) :
          scenes;
      })
    );
  }

  private filterByDate$(scenes$: Observable<CMRProduct[]>) {
    return combineLatest([
      scenes$,
      this.store$.select(getDateRange),
      this.store$.select(getSearchType),]
    ).pipe(
      debounceTime(0),
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
            if (scene.metadata.date <  moment.utc("1970-01-02T00:00:00+00:00")) {
              return true
            }
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

  private dayInSeason(startDate: moment.Moment, endDate: moment.Moment, season: Range<number | null>) {
    if (season.start < season.end) {
        return (
          season.start <= this.getDayOfYear(new Date(startDate.toISOString()))
          && season.end >= this.getDayOfYear(new Date(endDate.toISOString()))
        );
      } else {
        return !(
          season.start >= this.getDayOfYear(new Date(startDate.toISOString()))
          && season.start >= this.getDayOfYear(new Date(endDate.toISOString()))
          && season.end <= this.getDayOfYear(new Date(startDate.toISOString()))
          && season.end <= this.getDayOfYear(new Date(endDate.toISOString()))
        );
      }
  }

  private getDayOfYear(date: Date) {
    const temp = new Date(date.getFullYear(), 0, 0);
    return Math.floor(date.getTime() - temp.getTime()) / 1000 / 60 / 60 / 24;
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
      debounceTime(0),
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
              || fileIds.includes(scene.id);
            }
          );
        }

        return scenes;
      }
      )
    );
  }
}
