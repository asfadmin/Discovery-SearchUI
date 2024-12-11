import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, computed, signal } from '@angular/core';
import { distinctUntilChanged, first, map, Observable, Subject, withLatestFrom } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as chartStore from '@store/charts';

import {
  DrawService, MapService, NetcdfService, PointHistoryService, ScreenSizeService,
  WktService
} from '@services';
import { Breakpoints, SearchType } from '@models';

import { SubSink } from 'subsink';

import { Point } from 'ol/geom';
import { getTimeseriesChartStates } from '@store/charts';
import * as filtersStore from '@store/filters';
import * as models from '@models';
import * as uiStore from '@store/ui';
import {Store} from '@ngrx/store';

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

  // public pointHistory = [];

  // public chartData = new Subject<any>;
  public chartStates: models.timeseriesChartItemState[] = []
  public allSeriesChecked$ = this.store$.select(chartStore.getAreAllTimeseriesChecked)
  public temporalRange: models.Range<number> = {start: 0, end: 0};
  public temporalRangeValues$ = new Subject<number[]>();
  public maxRange: models.Range<number> = {start: 0, end: 0};
  public dataDateMin: Date;
  public dataDateMax: Date;
  public selectedSeries: number = -1;
  // private timeseries_subscription: Subscription;


  public totalDisplacement = 0;
  public dateRange = [];
  public totalPoints = 0;

  // public isLoading = false;

  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public pointHistoryService: PointHistoryService,
    private drawService: DrawService,
    private mapService: MapService,
    private netcdfService: NetcdfService,
    private wktService: WktService
  ) {}

  ngOnInit(): void {
    this.pointHistoryService.clearPoints();

    this.subs.add(
      this.store$.select(uiStore.getActiveWkt).pipe(distinctUntilChanged()).subscribe(wkt => {
        if (!wkt)
          this.selectedSeries = null;
        else
          this.respondToActiveWkt(wkt);
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
      this.chartStates = Object.values(chartStates);
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

    this.subs.add(this.store$.select(getTimeseriesChartStates).pipe(
      withLatestFrom(this.pointHistoryService.history$)
    ).subscribe(([chartStates, history]) => {
      let data = []
      for (const p of history) {
        data.push({ point: p.point, seriesNumber: chartStates[p.wkt].seriesNumber, color: chartStates[p.wkt].color })
      }
      this.mapService.setDisplacementLayer(data);
    }));

    let thing: string = localStorage.getItem('timeseries-points')
    if (thing && thing.length > 0) {
      let previous_points: any[] = thing?.split(';');
      if (previous_points.length > 0) {
        previous_points = previous_points?.map(value => {
          return this.wktService.wktToFeature(value, 'EPSG:4326');
        })
        previous_points?.forEach((point, idx) => {
          let allPointsData = [];
          this.pointHistoryService.addPoint(point.getGeometry(), idx + 1);
          this.netcdfService.getTimeSeries(point.getGeometry(), this.flightDirection).pipe(first()).subscribe( data => {
            allPointsData.push(data);
            // this.chartData.next(allPointsData);
            this.maxRange = this.temporalRange = this.getMaxRange(allPointsData);
          })
        });
      }
    }

    this.subs.add(this.drawService.polygon$.pipe(
      withLatestFrom(this.store$.select(chartStore.getMinSeriesNumber))
    ).subscribe(([polygon, minSeriesNumber]) => {
      if(polygon) {
        let temp = polygon.getGeometry().clone() as Point;
        temp.transform('EPSG:3857', 'EPSG:4326')
        if (polygon.getGeometry().getType() === 'Point') {
          this.pointHistoryService.addPoint(temp, minSeriesNumber);
          // this.selectedPoint = temp;
        }
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
      this.netcdfService.getTimeSeries(series.geoemetry, this.flightDirection).pipe(first()).subscribe(data => {
        allPointsData.push(data);
        // this.chartData.next(allPointsData);
        this.temporalRange = this.getMaxRange(allPointsData);
      })
    }
    this.maxRange = this.getMaxRange(allPointsData);
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
    const wkt = this.chartStates[index]?.wkt
    this.store$.dispatch(chartStore.setTimeseriesChecked({wkt, checked}))
  }

  public respondToActiveWkt(wkt: string) {
    this.chartStates.forEach((item) => {
      if (item.wkt == wkt) {
        console.log('timeseries-result-menu matched active Wkt:', wkt, 'Series', item.seriesNumber);
        this.selectedSeries = item.seriesNumber;
      }
    });
  }

  public deletePoint(index: number) {
    this.pointHistoryService.removePoint(index);
  }

  ngOnDestroy() {
    this.pointHistoryService.clearPoints();
    this.subs.unsubscribe();
  }
}
