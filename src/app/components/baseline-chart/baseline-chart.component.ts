import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';

import { SubSink } from 'subsink';
import { ScenesService } from '@services';
import { criticalBaselineFor, CMRProduct } from '@models';
import * as d3 from 'd3';
export enum ChartDatasets {
  MASTER = 0,
  SELECTED = 1,
  DOWNLOADS = 2,
  PRODUCTS = 4,
  MIN_CRITICAL = 5,
  MAX_CRITICAL = 6
}
interface Point {
  x: number;
  y: number;
  id?: string;
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

  private data = [[], [], [], [], [], [], [], []];
  private svg;

  private margin = { top: 10, right: 30, bottom: 30, left: 60 };
  private width = 840 - this.margin.left - this.margin.right;
  private height = 350 - this.margin.top - this.margin.bottom;
  private dotsContainer;
  private criticalBoxContainer;
  private zoom;
  private zoomBox;
  private currentTransform;

  private x;
  private xAxis;
  private y;
  private yAxis;

  private tooltip;

  private clipContainer;
  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    this.createSVG();
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
      combineLatest([
        products$,
        this.store$.select(scenesStore.getSelectedScene)]
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
            this.criticalBoxContainer
              .attr('x', this.x(this.data[ChartDatasets.MIN_CRITICAL][0].x))
              .attr('y', this.y(this.data[ChartDatasets.MAX_CRITICAL][1].y))
              .attr('width', this.x(this.data[ChartDatasets.MAX_CRITICAL][1].x) - this.x(this.data[ChartDatasets.MIN_CRITICAL][0].x))
              .attr('height', this.y(this.data[ChartDatasets.MIN_CRITICAL][0].y) - this.y(this.data[ChartDatasets.MAX_CRITICAL][1].y));
            this.isFirstLoad = false;
          }
          this.updateChart();

        })
    );

    this.subs.add(
      combineLatest([
        this.store$.select(queueStore.getQueuedProductIds),
        this.store$.select(scenesStore.getAllProducts)]
      ).pipe(
        map(([queueIds, products]) => {
          const ids = new Set(queueIds);

          return products.filter(product => ids.has(product.id));
        }),
        map(products => products.map(this.productToPoint)),
      ).subscribe(
        points => {
          this.setDataset(ChartDatasets.DOWNLOADS, points);
        }
      )
    );

    this.subs.add(
      combineLatest([
        this.store$.select(scenesStore.getMasterName),
        this.store$.select(scenesStore.getAllProducts)]
      ).pipe(
        map(([masterName, products]) => products
          .filter(product => product.name === masterName)
          .pop()
        ),
        filter(product => !!product),
        map(this.productToPoint)
      ).subscribe(point => {
        this.setDataset(ChartDatasets.MASTER, [point]);
      })
    );
  }

  private createSVG() {
    this.svg = d3.select(this.baselineChart.nativeElement).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.drawChart();
  }
  private drawChart() {
    this.clipContainer = this.svg.append('g')
      .attr('clip-path', 'url(#clip)');
    this.criticalBoxContainer = this.clipContainer.append('g').append('rect')
      .attr('fill', '#f2f2f2');
    this.zoomBox = this.clipContainer.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('cursor', 'pointer')
      .style('fill', 'transparent')
      .style('pointer-events', 'all');
    this.x = d3.scaleLinear()
      .range([0, this.width]);
    this.xAxis = this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(this.x));
    this.y = d3.scaleLinear()
      .range([this.height, 0]);
    this.yAxis = this.svg.append('g').call(d3.axisLeft(this.y));

    this.xAxis.call(
      d3.axisBottom(this.x)
        .tickSize(-this.height)
    );
    this.yAxis.call(
      d3.axisLeft(this.y)
        .tickSize(-this.width)
    );

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.dotsContainer = this.clipContainer.append('g');
    this.dotsContainer
      .selectAll('circle')
      .data(this.data[ChartDatasets.PRODUCTS])
      .join('circle')
      .attr('cx', d => this.x(d.x))
      .attr('cy', d => this.y(d.y))
      .attr('r', 5)
      .attr('fill', '#00bcd4');

    this.zoom = d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', (eve: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.currentTransform = eve.transform;
        this.updateChart();
      });

    if (this.currentTransform) {
      this.zoomBox.call(this.zoom.transform, this.currentTransform);
    }

    this.zoomBox.call(this.zoom);

    this.svg.append('defs').append('SVG:clipPath')
      .attr('id', 'clip')
      .append('SVG:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0);
  }
  private updateChart() {
    const newX = this.currentTransform?.rescaleX(this.x) ?? this.x;
    const newY = this.currentTransform?.rescaleY(this.y) ?? this.y;

    this.xAxis.call(
      d3.axisBottom(newX)
        .tickSize(-this.height)
    );
    this.yAxis.call(
      d3.axisLeft(newY)
        .tickSize(-this.width)
    );

    this.dotsContainer.selectAll('circle').data(this.data[ChartDatasets.PRODUCTS]).join('circle')
      .attr('cx', d => newX(d.x))
      .attr('cy', d => newY(d.y));

    this.criticalBoxContainer.attr('x', newX(this.data[ChartDatasets.MIN_CRITICAL][0].x))
      .attr('y', newY(this.data[ChartDatasets.MAX_CRITICAL][1].y))
      .attr('width', newX(this.data[ChartDatasets.MAX_CRITICAL][1].x) - newX(this.data[ChartDatasets.MIN_CRITICAL][0].x))
      .attr('height', newY(this.data[ChartDatasets.MIN_CRITICAL][0].y) - newY(this.data[ChartDatasets.MAX_CRITICAL][1].y));
  }
  private setDataset(dataset: ChartDatasets, data) {
    this.data[dataset] = data;
    const self = this;
    if (dataset === ChartDatasets.PRODUCTS || dataset === ChartDatasets.DOWNLOADS) {
      const transformedY = this.currentTransform?.rescaleY(this.y) ?? this.y;
      const transformedX = this.currentTransform?.rescaleX(this.x) ?? this.x;
      this.dotsContainer.selectAll('circle').data(this.data[ChartDatasets.PRODUCTS]).join('circle')
        .attr('cx', d => transformedX(d.x))
        .attr('cy', d => transformedY(d.y))
        .attr('r', (d) => {
          if (d.id === this.data[ChartDatasets.SELECTED][0].id) {
            return 10;
          }
          return 5;
        })
        .attr('fill', function (d) {
          if (self.data[ChartDatasets.MASTER].length > 0 && self.data[ChartDatasets.MASTER][0]?.id === d.id) {
            return 'black';
          } else if (self.data[ChartDatasets.SELECTED].length > 0 && self.data[ChartDatasets.SELECTED][0]?.id === d.id) {
            return '#ff0000';
          } else if (self.data[ChartDatasets.DOWNLOADS].some(p => p.id === d.id)) {
            return '#215c8b';
          } else {
            return '#808080';
          }
        })
        .on('mouseover', function (event, d: Point) {
          self.tooltip
            .style('opacity', .9);
          self.tooltip.html(`${d.x} days, ${d.y} m`)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 20}px`);
          d3.select(this).attr('r', 10);
        })
        .on('mouseout', function (_event, d) {
          self.tooltip.transition()
            .duration(500)
            .style('opacity', 0);
          if (d.id === self.data[ChartDatasets.SELECTED][0].id) {
            d3.select(this).attr('r', 10);
          } else {
            d3.select(this).attr('r', 5);
          }
        })
        .on('click', function (_event, d: Point) {
          const action = new scenesStore.SetSelectedScene(d.id);
          self.store$.dispatch(action);
        });
    }
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
      { x: min.x - buffer - 10, y: -this.criticalBaseline },
      { x: max.x + buffer + 10, y: -this.criticalBaseline }
    ];

    const maxDataset = [
      { x: min.x - buffer - 10, y: this.criticalBaseline },
      { x: max.x + buffer + 10, y: this.criticalBaseline }
    ];

    return { minDataset, maxDataset };
  }

  private determineMinMax(points: { x: number, y: number }[]) {
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

  private updateScales(extrema: { min: { x: number, y: number }, max: { x: number, y: number } }) {
    const { min, max } = extrema;
    const xBuffer = Math.floor((max.x - min.x) * .25);
    const yBuffer = Math.floor((max.y - min.y) * .25);
    this.x = d3.scaleLinear()
      .domain([min.x - xBuffer, max.x + xBuffer])
      .range([0, this.width]);
    this.y = d3.scaleLinear().domain([min.y - yBuffer, max.y + yBuffer]).range([this.height, 0]);
    this.xAxis.call(
      d3.axisBottom(this.x)
        .tickSize(-this.height)
    );
    this.yAxis.call(
      d3.axisLeft(this.y)
        .tickSize(-this.width)
    );
    this.updateChart();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
