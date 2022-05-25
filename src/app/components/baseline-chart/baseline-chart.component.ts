import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { SubSink } from 'subsink';
import {  ScenesService } from '@services';
import { criticalBaselineFor, CMRProduct } from '@models';
import * as d3 from 'd3';
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

  private criticalBaseline: number;
  private isFirstLoad = true;
  private offsets = { temporal: 0, perpendicular: 0 };
  private subs = new SubSink();

  private data: {x: number, y: number, id?: string}[][] = [[], [], [], [], [], [], [], []];
  private svg;

  private margin = { top: 10, right: 30, bottom: 30, left: 60 };
  private width = 840 - this.margin.left - this.margin.right;
  private height = 350 - this.margin.top - this.margin.bottom;
  private dotsContainer;

  private x;
  private y;
  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    // this.initChart();
    this.createSVG();
    this.drawChart();
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
        this.store$.select(scenesStore.getSelectedScene)
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

          // this.chart.update();
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
          // this.chart.update();
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
        // this.chart.update();
      })
    );
  }
  // private handleZoom(_event) {
  //   console.log('ahhhhhhhhhhhhhh')
  // }
  private createSVG() {
    this.svg = d3.select('div#baseline').append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top  + this.margin.bottom)
    .append('g')
    .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)

  }
  private drawChart() {

    this.x = d3.scaleLinear()
    .domain([-500, 3000])
    .range([0, this.width]);
  this.svg.append('g')
    .attr('transform', `translate(0, ${this.height})`)
    .call(d3.axisBottom(this.x));
    this.y = d3.scaleLinear().domain([-200, 200]).range([this.height, 0]);
    this.svg.append('g').call(d3.axisLeft(this.y));

    // add dots of products
    this.dotsContainer = this.svg.append('g')
    .selectAll('circle')
    .data(this.data[ChartDatasets.PRODUCTS])
    .join()
    .append('circle')
    .attr('cx', d => this.x(d.x))
    .attr('cy', d => this.y(d.y))
    .attr('r', 5)
    .attr('fill', '#00bcd4');
    function handleStuff(e){
      console.log(e);
      console.log('ahhh');
    }
    const zoom = d3.zoom().on('zoom', handleStuff);
    d3.select('svg').call(zoom);
  }
  private setDataset(dataset: ChartDatasets, data) {
    this.data[dataset] = data;
    console.log(this.data);
    const self = this;
    this.dotsContainer.data(this.data[ChartDatasets.PRODUCTS]).join('circle')
    .attr('cx', d => this.x(d.x))
    .attr('cy', d => this.y(d.y))
    .attr('r', 5)
    .attr('fill', function (d) {
      if (self.data[ChartDatasets.MASTER].length > 0 && self.data[ChartDatasets.MASTER][0]?.id === d.id) {
        return 'black';
      } else if (self.data[ChartDatasets.SELECTED].length > 0 && self.data[ChartDatasets.SELECTED][0]?.id === d.id) {
        return 'red';
      } else if (self.data[ChartDatasets.DOWNLOADS].some(p => p.id === d.id)) {
        return 'blue';
      } else {
        return '#9e9e9e';
      }
    });
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

  private updateScales(_extrema) {
    // const { min, max } = extrema;
    // const xBuffer = (max.x - min.x) * .25;
    // const yBuffer = (max.y - min.y) * .25;

    // TODO: update the graph scales things

    // this.chart.options.scales.xAxes[0].ticks.min = Math.floor((min.x - xBuffer) / 100) * 100;
    // this.chart.options.scales.xAxes[0].ticks.max = Math.ceil((max.x + xBuffer) / 100) * 100;

    // this.chart.options.scales.yAxes[0].ticks.min = Math.floor((min.y - yBuffer) / 100) * 100;
    // this.chart.options.scales.yAxes[0].ticks.max = Math.ceil((max.y + yBuffer) / 100) * 100;
  }

  // private initChart() {
  //   this.chart = this.chartService.makeChart(
  //     this.baselineChart.nativeElement,
  //     this.setHoveredItem,
  //     this.onSelectHoveredScene
  //   );
  // }

  // private setHoveredItem = (tooltip, data) => {
  //   const dataset = data.datasets[tooltip.datasetIndex].data;

  //   this.hoveredProductId = dataset[tooltip.index].id;
  // }

  // private onSelectHoveredScene = () => {
  //   const action = new scenesStore.SetSelectedScene(this.hoveredProductId);
  //   this.store$.dispatch(action);
  // }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
