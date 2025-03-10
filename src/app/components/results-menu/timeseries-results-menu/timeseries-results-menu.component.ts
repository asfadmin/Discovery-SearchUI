import {Component, computed, ElementRef, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {distinctUntilChanged, filter, first, map, Observable, Subject, withLatestFrom} from 'rxjs';
import {ResizeEvent} from 'angular-resizable-element';

import {AppState} from '@store';
import * as searchStore from '@store/search';
import * as chartStore from '@store/charts';
import {getTimeseriesChartStates} from '@store/charts';

import {DrawService, NetcdfService, PointHistoryService, ScreenSizeService, WktService} from '@services';
import * as models from '@models';
import {Breakpoints, SearchType} from '@models';

import {SubSink} from 'subsink';

import {Geometry} from 'ol/geom';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import {Store} from '@ngrx/store';
import {MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {PointHistoryState} from '@services/point-history.service';

export interface Task {
  aoi: string;
  checked: boolean;
  subtasks?: Task[];
}

export interface PointSeries {
  bytes: number;
  interferometric_correlation: number;
  netcdf_uri: string;
  persistent_scatterer_mask: number;
  reference_datetime: string;
  secondary_datetime: string;
  short_wavelength_displacement: number;
  temporal_baseline: number;
  temporal_coherence: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-timeseries-results-menu',
  templateUrl: './timeseries-results-menu.component.html',
  styleUrls: ['./timeseries-results-menu.component.scss',  '../results-menu.component.scss'],
})
export class TimeseriesResultsMenuComponent implements OnInit, OnDestroy {

  @ViewChild('listCard', {read: ElementRef}) listCardView: ElementRef;
  @ViewChild('chartCard', {read: ElementRef}) chartCardView: ElementRef;
  @ViewChild('radio-group', {read: ElementRef}) radioGroup: ElementRef;

  @Input() resize$: Observable<void>;
  public searchType: SearchType;
  public isAddingPoints = false;

  public wktListMaxWidth = '225px';
  public listCardMaxWidth = '300px';
  public chartCardMaxWidth = '55%';
  private minChartWidth = 25.0;

  public tsPath: any

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  private subs = new SubSink();
  private flightDirection: models.FlightDirection = models.FlightDirection.ASCENDING;

  public chartStates: models.timeseriesChartItemState[] = []
  public allSeriesChecked$ = this.store$.select(chartStore.getAreAllTimeseriesChecked)
  public temporalRange: models.Range<number> = {start: 0, end: 0};
  public temporalRangeValues$ = new Subject<number[]>();
  public maxRange: models.Range<number> = {start: 0, end: 0};
  public selectedSeries: number = -1;


  public totalDisplacement = 0;
  public dateRange = [];
  public totalPoints = 0;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public pointHistoryService: PointHistoryService,
    private drawService: DrawService,
    private netcdfService: NetcdfService,
    private wktService: WktService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.pointHistoryService.clearPoints();

    this.subs.add(
      this.store$.select(uiStore.getActiveWkt).pipe(distinctUntilChanged()).subscribe(details => {
        if (!details?.uuid)
          this.selectedSeries = null;
        else
          this.respondToActiveWkt(details?.uuid);
      }));

    this.subs.add(
      this.store$.select(filtersStore.getFlightDirections).pipe(
        map(flightDirs => flightDirs[0] ?? models.FlightDirection.ASCENDING),
        distinctUntilChanged(),
      ).subscribe(
        flightDir => {
          this.flightDirection = flightDir;
          this.updateChart()
        }
      )
    )
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(this.store$.select(getTimeseriesChartStates).subscribe(chartStates => {
      let seriesFrameCount = [];
      this.chartStates = Object.values(chartStates);
      this.chartStates = this.chartStates.sort((a, b) => a.seriesNumber - b.seriesNumber);
      this.chartStates.forEach((series) => {
        // seriesFrameCount.push(this.getFrameCount(series.frames));
        seriesFrameCount[series.seriesNumber] = this.getFrameCount(series.frames);
      });
      console.log('this.chartStates', this.chartStates);
      console.log('seriesFrameCount', seriesFrameCount);
    }
    ));

    this.subs.add(
      this.temporalRangeValues$.subscribe(
        range => {
          const action = new filtersStore.SetTemporalRange({ start: range[0], end: range[1] });
          this.store$.dispatch(action);
        }
      )
    );

    let thing: string = localStorage.getItem('timeseries-points')
    if (thing && thing.length > 0) {
      let previousPoints: PointHistoryState[] = JSON.parse(thing);
      if (previousPoints.length > 0) {
        previousPoints?.forEach((point) => {
          let wkt = this.wktService.wktToFeature(point.wkt, 'EPSG:4326');
          this.pointHistoryService.addPoint(wkt.getGeometry(), point.seriesNumber, point.seriesName, point.drawMode, point.uuidSeries);
        });
        this.updateChart();
      }
    }

    this.subs.add(this.drawService.polygon$.pipe(
      filter(polygon => !!polygon),
      withLatestFrom(this.store$.select(chartStore.getMinSeriesNumber))
    ).subscribe(([polygon, minSeriesNumber]) => {
      if(!!polygon && this.searchType === models.SearchType.DISPLACEMENT) {
        let temp = polygon.getGeometry().clone() as Geometry;
        temp.transform('EPSG:3857', 'EPSG:4326')
        this.pointHistoryService.addPoint(temp, minSeriesNumber, '', this.drawService.currentDrawMode);
        this.updateChart();
      }
    }))
  }

  public onResizeEnd(event: ResizeEvent): void {
    const windowWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    const newChartWidth = event.rectangle.width > windowWidth ? windowWidth : event.rectangle.width;
    const newChartMaxWidth = Math.max(
      this.minChartWidth,
      Math.round((newChartWidth / windowWidth) * 100)
      );
    const newListMaxWidth = 100 - newChartMaxWidth;

    this.listCardMaxWidth = newListMaxWidth.toString() + '%';
    this.chartCardMaxWidth = newChartMaxWidth.toString() + '%';
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  public updateChart(): void {
    let allPointsData = [];
    for (const series of this.chartStates) {
      if (!series.frames) {
        this.netcdfService.getFrames(series.wkt, this.flightDirection).pipe(first()).subscribe(data => {
          // series.frames = data;
          this.store$.dispatch(chartStore.setFrames({ 'uuid': series.uuidSeries, 'frames': data }))

          for(let frame_id of Object.keys(data)) {
            this.netcdfService.getTimeSeries(data[frame_id], this.flightDirection, frame_id, series.uuidSeries)
              .pipe(first()).subscribe(data => {
                if (!!data) {
                  allPointsData.push(data);
                }
                this.temporalRange = this.getMaxRange(allPointsData);
              })
          }
        })
      }
      console.log('series.frames', series.seriesNumber, allPointsData);
    }
    this.maxRange = this.getMaxRange(allPointsData);
  }

  public getFrameCount(point: any): number {
    let frameCount = 0;
    for (let x of Object.keys(point)) {
      console.log('point', point[x]);
      frameCount++;
    }
    return frameCount;
  }


  readonly task = signal<Task>({
    aoi: 'ALL AOIs',
    checked: false,
    subtasks: [],
  });

  readonly partiallyComplete = computed(() => {
    const task = this.task();
    if (!task.subtasks) {
      return false;
    }
    return task.subtasks.some(t => t.checked) && !task.subtasks.every(t => t.checked);
  });

  public toggleAllSeries(checked: boolean) {
    this.store$.dispatch(chartStore.setAllTimeseriesChecked({checked}));
  }

  public getMaxRange(allSeries: PointSeries[]) {
    let minDate = null;
    let maxDate = null;
    for (let points of allSeries) {
      for (let key of Object.keys(points).filter(x => x !== 'mean' && x !== 'aoi')) {
        let date = new Date(points[key].secondary_datetime);
        if (minDate === null || date < minDate) {
          minDate = date;
        }
        if (maxDate === null || date > maxDate) {
          maxDate = date;
        }
      }
    }
    let dateRange: models.Range<any> = {start: minDate, end: maxDate};
    this.temporalRangeValues$.next([dateRange.start, dateRange.end]);
    return dateRange;
  }

  public updateSeries(checked: boolean, index?: number) {
    const uuid = this.chartStates[index]?.uuidSeries
    this.store$.dispatch(chartStore.setTimeseriesChecked({uuid, checked}))
  }

  public respondToActiveWkt(uuid: string) {
    this.chartStates.forEach((item) => {
      if (item.uuidSeries == uuid) {
        // TODO: For now leave this but change it over to uuid
        this.selectedSeries = item.seriesNumber;
      }
    });
  }

  public setActiveWkt(uuid: string) {
    this.store$.dispatch(new uiStore.SetActiveDetails({'uuid': uuid, 'frame': null}));
  }

  public deletePoint(index: number) {
    this.pointHistoryService.removePoint(index);
  }
  public deleteAllPoints(): void {
   this.pointHistoryService.clear();
  }

  public openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialog);

    dialogRef.afterClosed().subscribe((deleteAll: boolean) => {
      if (deleteAll) {
        this.deleteAllPoints();
      }
    });
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
    this.pointHistoryService.clearPoints();
  }
}

@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButton,
    MatDialogClose
  ],
  standalone: true
})
export class ConfirmationDialog {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>) { }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}


