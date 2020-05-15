import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import Chart from 'chart.js';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { SubSink } from 'subsink';
import { ChartService, ScenesService } from '@services';
import { criticalBaselineFor, CMRProduct } from '@models';

export enum ChartDatasets {
  MASTER = 0,
  SELECTED = 1,
  DOWNLOADS = 2,
  WITHIN_BASELINE = 3,
  PRODUCTS = 4,
  MIN_CRITICAL = 5,
  MAX_CRITICAL = 6
}

@Component({
  selector: 'app-sbas-chart',
  templateUrl: './sbas-chart.component.html',
  styleUrls: ['./sbas-chart.component.scss']
})
export class SBASChartComponent implements OnInit, OnDestroy {
  @ViewChild('sbasChart', { static: true }) baselineChart: ElementRef;

  private chart: Chart;
  private selected: CMRProduct;
  private criticalBaseline: number;
  private hoveredProductId;
  private isFirstLoad = true;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private chartService: ChartService,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    const pairs$ = this.scenesService.pairs$();

    this.subs.add(
        pairs$.subscribe(pairs => {
          const pairLines = pairs.map(pair => this.pairToLine(pair));

          this.chart = this.chartService.makeChart(
            this.baselineChart.nativeElement,
            (_, __) => {},
            (_, __) => {},
            pairLines
          );
        })
    );
  }

  private setDataset(dataset: ChartDatasets, data) {
    this.chart.data.datasets[dataset].data = data;
  }

  private pairToLine(pair) {
    const points = pair.map(product => this.productToPoint(product));

    const line = {
      data: points,
      type: 'line',
      ...this.lineStyle()
    };

    return line;
  }

  private dummyData()  {
    return [{
      'data': [
        {'x': -2041, 'y': 47, 'id': 'S1A_IW_SLC__1SSV_20141006T155628_20141006T155645_002711_003089_4288-SLC'},
        {'x': -2017, 'y': -69, 'id': 'S1A_IW_SLC__1SSV_20141030T155627_20141030T155645_003061_003805_1F1F-SLC'}
      ],
      'type': 'line',
    }, {
      'data': [
        {'x': -2041, 'y': 47, 'id': 'S1A_IW_SLC__1SSV_20141006T155628_20141006T155645_002711_003089_4288-SLC'},
        {'x': -1993, 'y': 135, 'id': 'S1A_IW_SLC__1SSV_20141123T155627_20141123T155645_003411_003FAB_4687-SLC'}
      ],
      'type': 'line',
    }].map(dataset => {
      return { ...dataset,
        fill: false,
        borderColor: 'grey',
        backgroundColor: 'grey',
        borderWidth: 2,
        pointBackgroundColor: 'black',
        pointBorderColor: 'white',
        radius: 5,
        pointHoverBackgroundColor: 'grey',
        pointHoverBorderColor: 'black',
      };
    });
  }

  private lineStyle() {
    return {
      fill: false,
      borderColor: 'black',
      backgroundColor: 'black',
      borderWidth: 2,
      pointBackgroundColor: 'grey',
      pointBorderColor: 'white',
      radius: 5,
      pointHoverBackgroundColor: 'grey',
      pointHoverBorderColor: 'black',
    };
  }

  private productToPoint = (product: CMRProduct) => {
    return ({
      x: product.metadata.temporal,
      y: product.metadata.perpendicular,
      id: product.id
    });
  }

  private criticalBaselineDataset(extrema) {
    const { min, max } = extrema;
    const buffer = (max.x - min.x) * .25;

    const minDataset = [
      {x: min.x - buffer - 10, y: -this.criticalBaseline},
      {x: max.x + buffer + 10, y: -this.criticalBaseline}
    ];

    const maxDataset = [
      {x: min.x - buffer - 10, y: this.criticalBaseline},
      {x: max.x + buffer + 10, y: this.criticalBaseline}
    ];

    return { minDataset, maxDataset };
  }

  private determineMinMax(points: {x: number, y: number}[]) {
    const min = { x: 0, y: 0 };
    const max = { x: 0, y: 0 };

    points.map(point => {
      if (point.x < min.x) {
        min.x = point.x;
      }
      if (point.y < min.y) {
        min.y = point.y;
      }
      if (point.x > max.x) {
        max.x = point.x;
      }
      if (point.y > max.y) {
        max.y = point.y;
      }
    });

    return { min, max };
  }

  private updateScales(extrema) {
    const { min, max } = extrema;
    const xBuffer = (max.x - min.x) * .25;
    const yBuffer = (max.y - min.y) * .25;

    this.chart.options.scales.xAxes[0].ticks.min = Math.floor((min.x - xBuffer) / 100) * 100;
    this.chart.options.scales.xAxes[0].ticks.max = Math.ceil((max.x + xBuffer) / 100) * 100;

    this.chart.options.scales.yAxes[0].ticks.min = Math.floor((min.y - yBuffer) / 100) * 100;
    this.chart.options.scales.yAxes[0].ticks.max = Math.ceil((max.y + yBuffer) / 100) * 100;
  }

  private initChart() {
    this.chart = this.chartService.makeChart(
      this.baselineChart.nativeElement,
      this.setHoveredItem,
      this.onSelectHoveredScene
    );
  }

  private setHoveredItem = (tooltip, data) => {
    const dataset = data.datasets[tooltip.datasetIndex].data;

    this.hoveredProductId = dataset[tooltip.index].id;
  }

  private onSelectHoveredScene = () => {
    const action = new scenesStore.SetSelectedScene(this.hoveredProductId);
    this.store$.dispatch(action);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
