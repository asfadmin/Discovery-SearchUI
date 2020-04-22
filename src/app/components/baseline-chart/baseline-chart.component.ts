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
  selector: 'app-baseline-chart',
  templateUrl: './baseline-chart.component.html',
  styleUrls: ['./baseline-chart.component.scss']
})
export class BaselineChartComponent implements OnInit, OnDestroy {
  @ViewChild('baselineChart', { static: true }) baselineChart: ElementRef;

  private chart: Chart;
  private selected: CMRProduct;
  private criticalBaseline: number;
  private hoveredProductId;
  private isFirstLoad = true;
  private offsets = { temporal: 0, perpendicular: 0 };
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private chartService: ChartService,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    this.initChart();

    const products$ = this.scenesService.scenes$().pipe(
      tap(products => products.map(
        product => this.criticalBaseline = criticalBaselineFor(product)
      )),
      map(products => products.map(this.productToPoint)),
    );

    this.subs.add(
      this.store$.select(scenesStore.getMasterOffsets).subscribe(
        offsets => this.offsets = offsets
      )
    );

    this.subs.add(
      combineLatest(
        products$,
        this.store$.select(scenesStore.getSelectedScene).pipe(
          tap(selected => this.selected = selected),
        )
      ).subscribe(
        ([points, selected]) => {
          const extrema = this.determineMinMax(points);
          const { minDataset, maxDataset } = this.criticalBaselineDataset(extrema);

          if (selected) {
            const selectedPoint = this.productToPoint(selected);
            this.setDataset(ChartDatasets.SELECTED, [selectedPoint]);
          }

          this.setDataset(ChartDatasets.PRODUCTS, points);
          this.setDataset(ChartDatasets.MIN_CRITICAL, minDataset);
          this.setDataset(ChartDatasets.MAX_CRITICAL, maxDataset);

          if (this.isFirstLoad) {
            this.updateScales(extrema);
            this.isFirstLoad = false;
          }

          this.chart.update();
        })
    );

    this.subs.add(
      combineLatest(
        this.store$.select(queueStore.getQueuedProductIds),
        this.store$.select(scenesStore.getAllProducts),
      ).pipe(
        map(([queueIds, products]) => {
          const ids = new Set(queueIds);

          return products.filter(product => ids.has(product.id));
        }),
        map(products => products.map(this.productToPoint)),
      ).subscribe(
        points => {
          this.setDataset(ChartDatasets.DOWNLOADS, points);
          this.chart.update();
        }
      )
    );

    this.subs.add(
      combineLatest(
        this.store$.select(scenesStore.getMasterName),
        this.store$.select(scenesStore.getAllProducts),
      ).pipe(
        map(([masterName, products]) => products
          .filter(product => product.name === masterName)
          .pop()
        ),
        filter(product => !!product),
        map(this.productToPoint)
      ).subscribe(point => {
        this.setDataset(ChartDatasets.MASTER, [point]);
        this.chart.update();
      })
    );
  }

  private setDataset(dataset: ChartDatasets, data) {
    this.chart.data.datasets[dataset].data = data;
  }

  private productToPoint = (product: CMRProduct) => {
    return ({
      x: product.metadata.temporal + this.offsets.temporal,
      y: product.metadata.perpendicular + this.offsets.perpendicular,
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

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
