import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { first, Observable, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import { Breakpoints,  LonLat,  SearchType } from '@models';
import { DrawService, MapService, NetcdfService, PointHistoryService, ScreenSizeService } from '@services';

import { SubSink } from 'subsink';

import { Point} from 'ol/geom';
import { WKT } from 'ol/format';


@Component({
  selector: 'app-timeseries-results-menu',
  templateUrl: './timeseries-results-menu.component.html',
  styleUrls: ['./timeseries-results-menu.component.scss',  '../results-menu.component.scss']

})
export class TimeseriesResultsMenuComponent implements OnInit, OnDestroy {

  @ViewChild('listCard', {read: ElementRef}) listCardView: ElementRef;
  @ViewChild('chartCard', {read: ElementRef}) chartCardView: ElementRef;

  @Input() resize$: Observable<void>;
  public searchType: SearchType;


  public listCardMaxWidth = '38%';
  public chartCardMaxWidth = '55%';
  private minChartWidth = 25.0;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  public isSelectedPairCustom: boolean;
  private subs = new SubSink();

  public zoomInChart$ = new Subject<void>();
  public zoomOutChart$ =  new Subject<void>();
  public zoomToFitChart$ =  new Subject<void>();

  public pointHistory = [];


  public chartData = new Subject<any>


  constructor(
    private store$: Store<AppState>,
    private screenSize: ScreenSizeService,
    private pointHistoryService: PointHistoryService,
    private drawService: DrawService,
    private mapService: MapService,
    private netcdfService: NetcdfService
  ) { }
  private passDraw = false;

  ngOnInit(): void {
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
    this.subs.add(this.pointHistoryService.history$.subscribe(history => {
      this.pointHistory = history;
      this.mapService.setDisplacementLayer(history);
    }));
    this.subs.add(this.drawService.polygon$.subscribe(polygon => {
      if(polygon) {
        let temp = polygon.getGeometry().clone() as Point;
        temp.transform('EPSG:3857', 'EPSG:4326')
        if (polygon.getGeometry().getType() === 'Point' && !this.passDraw) {
          this.pointHistoryService.addPoint(temp)
        } else {
          this.passDraw = false;
        }
        this.updateChart({'lon': temp.getFlatCoordinates()[0], 'lat': temp.getFlatCoordinates()[1]});
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

  public zoomIn(): void {
    this.zoomInChart$.next();
  }

  public zoomOut(): void {
    this.zoomOutChart$.next();
  }

  public zoomToFit(): void {
    this.zoomToFitChart$.next();
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }
  public onPointClick(index: number) {
    this.passDraw = true;
    var format = new WKT();
    var wktRepresenation  = format.writeGeometry(this.pointHistory[index]);
    this.mapService.loadPolygonFrom(wktRepresenation.toString())
  }
  public updateChart(lonlat: LonLat): void {
    this.netcdfService.getTimeSeries(lonlat).pipe(first()).subscribe(data => {
      this.chartData.next(data);
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
