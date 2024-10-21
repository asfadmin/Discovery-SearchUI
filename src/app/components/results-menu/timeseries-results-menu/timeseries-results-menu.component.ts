import {Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, computed, signal} from '@angular/core';
import { first, Observable, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';
import * as mapStore from '@store/map';

import { Breakpoints, SearchType, MapInteractionModeType, MapDrawModeType } from '@models';
import { DrawService, MapService, NetcdfService, PointHistoryService, ScreenSizeService } from '@services';

import { SubSink } from 'subsink';

import { Point } from 'ol/geom';
import { WKT } from 'ol/format';
import { getPathRange } from '@store/filters';

export interface Task {
  aoi: string;
  checked: boolean;
  subtasks?: Task[];
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

  public pointHistory = [];

  public chartData = new Subject<any>;
  public selectedPoint: number;


  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    public pointHistoryService: PointHistoryService,
    private drawService: DrawService,
    private mapService: MapService,
    private netcdfService: NetcdfService
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );

    this.subs.add(
      this.store$.select(mapStore.getMapInteractionMode).subscribe(
        mode => this.isAddingPoints = mode === MapInteractionModeType.DRAW
      )
    );

    this.subs.add(
      this.store$.select(searchStore.getSearchType).subscribe(
        searchType => this.searchType = searchType
      )
    );

    this.subs.add(this.pointHistoryService.history$.subscribe(history => {
      this.pointHistory = history;
      this.mapService.setDisplacementLayer(history);
      console.log('results menu sub this.pointHistory', this.pointHistory);
      const task = this.task();
      let found = false
      for (const point of this.pointHistory) {
        found = false;
        for (const pt of task.subtasks) {
          if (pt.aoi.toString() === point.flatCoordinates.toString()) {
            found = true;
            break;
          }
        }
        if (!found) {
          let p = {aoi: point.flatCoordinates, checked: true};
          task.subtasks.push(p);
        }
      }

      console.log('results menu sub task.subtasks', task.subtasks);

      return {...task};

    }));

    this.subs.add(this.drawService.polygon$.subscribe(polygon => {
      if(polygon) {
        let temp = polygon.getGeometry().clone() as Point;
        temp.transform('EPSG:3857', 'EPSG:4326')
        if (polygon.getGeometry().getType() === 'Point') {
          this.pointHistoryService.addPoint(temp);
          // this.selectedPoint = temp;
        }
        this.updateChart();
      }
    }))

    this.netcdfService.getTimeSeries(getPathRange).pipe(first()).subscribe(data => {
      this.tsPath = data;
    });
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

  public onAddPointsMode(): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.store$.dispatch(new mapStore.SetMapDrawMode(MapDrawModeType.POINT));
  }

  public onStopAddPoints(): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.NONE));
  }

  public onPointClick(index: number) {
    this.pointHistoryService.selectedPoint = index;
    this.pointHistoryService.passDraw = true;
    let format = new WKT();
    let wktRepresenation  = format.writeGeometry(this.pointHistory[index]);
    this.mapService.loadPolygonFrom(wktRepresenation.toString())
  }

  public updateChart(): void {
    let allPointsData = [];
    for (const geometry of this.pointHistory) {
      this.netcdfService.getTimeSeries(geometry).pipe(first()).subscribe(data => {
        console.log('updateChart data', data);
        console.log('updateChart geometry', geometry);
        allPointsData.push(data);
      })
      console.log('updateChart allPointsData', allPointsData);
      this.chartData.next(allPointsData);
    }
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

  public updateSeries(checked: boolean, index?: number) {
    console.log('updateSeries', checked, index);
    this.task.update(task => {
      if (index === undefined) {
        task.checked = checked;
        task.subtasks?.forEach(t => (t.checked = checked));
      } else {
        task.subtasks![index].checked = checked;
        task.checked = task.subtasks?.every(t => t.checked) ?? true;
        this.pointHistoryService.selectedPoint = index;
        console.log('updateSeries() this.pointHistoryService.selectedPoint', this.pointHistoryService.selectedPoint);
        this.pointHistoryService.passDraw = true;
        let format = new WKT();
        let wktRepresentation  = format.writeGeometry(this.pointHistory[index]);
        this.mapService.loadPolygonFrom(wktRepresentation.toString())

      }
      console.log('updateSeries() task', task);
      console.log('updateSeries() task.subtasks', task.subtasks);
      console.log('updateSeries() this.pointHistory', this.pointHistory);
      return {...task};
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
