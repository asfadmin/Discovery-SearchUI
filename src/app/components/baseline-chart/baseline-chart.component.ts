import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import Chart from 'chart.js';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as baselineStore from '@store/baseline';

import { ChartService } from '@services';
import { criticalBaselineFor, CMRProduct } from '@models';

export enum ChartDatasets {
  MASTER = 0,
  SELECTED = 1,
  WITHIN_BASELINE = 2,
  PRODUCTS = 3,
  MIN_CRITICAL = 4,
  MAX_CRITICAL = 5
}

@Component({
  selector: 'app-baseline-chart',
  templateUrl: './baseline-chart.component.html',
  styleUrls: ['./baseline-chart.component.scss']
})
export class BaselineChartComponent implements OnInit {
  @ViewChild('baselineChart', { static: true }) baselineChart: ElementRef;

  private chart: Chart;
  private criticalBaseline: number;
  private hoveredProductId;

  constructor(
    private store$: Store<AppState>,
    private chartService: ChartService,
  ) { }

  ngOnInit(): void {
    this.initChart();

    const products$ = this.store$.select(scenesStore.getAllProducts);

    products$.pipe(
      tap(products => products.map(
        product => this.criticalBaseline = criticalBaselineFor(product)
      )),
      map(products => products.map(this.productToPoint)),
    ).subscribe(
      points => {
        const extrema = this.determineMinMax(points);
        const { minDataset, maxDataset } = this.criticalBaselineDataset(points, extrema);

        this.setDataset(ChartDatasets.PRODUCTS, points);
        this.setDataset(ChartDatasets.MIN_CRITICAL, minDataset);
        this.setDataset(ChartDatasets.MAX_CRITICAL, maxDataset);

        this.updateScales(extrema);

        this.chart.update();
      });

    this.store$.select(scenesStore.getSelectedScene).pipe(
      filter(user => !!user),
      map(this.productToPoint)
    ).subscribe(
      selectedPoint => {
        this.setDataset(ChartDatasets.SELECTED, [selectedPoint]);

        this.chart.update();
      }
    );
  }

  private setDataset(dataset: ChartDatasets, data) {
    this.chart.data.datasets[dataset].data = data;
  }

  private productToPoint = (product: CMRProduct) => {
    return ({
      x: product.metadata.temporal,
      y: product.metadata.perpendicular,
      id: product.id
    });
  }

  private criticalBaselineDataset(points: {x: number, y: number}[], extrema) {
    const { min, max } = extrema;

    const minDataset = [
      {x: -Number.MAX_SAFE_INTEGER, y: -this.criticalBaseline},
      {x: Number.MAX_SAFE_INTEGER, y: -this.criticalBaseline}
    ];

    const maxDataset = [
      {x: -Number.MAX_SAFE_INTEGER, y: this.criticalBaseline},
      {x: Number.MAX_SAFE_INTEGER, y: this.criticalBaseline}
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
    const buffer = (max.x - min.x) * .25;

    this.chart.options.scales.xAxes[0].ticks.min = Math.floor((min.x - buffer) / 100) * 100;
    this.chart.options.scales.xAxes[0].ticks.max = Math.ceil((max.x + buffer) / 100) * 100;
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
}
