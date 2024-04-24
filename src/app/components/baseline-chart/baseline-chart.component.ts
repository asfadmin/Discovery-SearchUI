import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { combineLatest } from 'rxjs';
import { map, tap, filter, } from 'rxjs/operators';

import { TranslateService } from "@ngx-translate/core";

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as queueStore from '@store/queue';


import { SubSink } from 'subsink';
import { ScenesService } from '@services';
import { criticalBaselineFor, CMRProduct } from '@models';
import * as d3 from 'd3';
import * as models from "@models";
import * as services from "@services";
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
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  private criticalBaseline: number;
  private isFirstLoad = true;
  private offsets = { temporal: 0, perpendicular: 0 };
  private subs = new SubSink();

  private data = [[], [], [], [], [], [], [], []];
  private svg;

  private margin = { top: 10, right: 30, bottom: 60, left: 60 };
  private width = 840 - this.margin.left - this.margin.right;
  private height = 350 - this.margin.top - this.margin.bottom;
  private dotsContainer;
  private criticalBoxContainer;
  private zoom;
  private currentTransform;

  private x;
  private xAxis;
  private y;
  private yAxis;

  private xExtent;
  private yExtent;

  private tooltip;

  private hoveredElement;
  private clipContainer;
  constructor(
    public translate: TranslateService,
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private screenSize: services.ScreenSizeService,

  ) { }

  ngOnInit(): void {
    this.createSVG();
    const products$ = this.scenesService.scenes$.pipe(
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
            let height =  this.y(this.data[ChartDatasets.MIN_CRITICAL][0].y) - this.y(this.data[ChartDatasets.MAX_CRITICAL][1].y)

            this.criticalBoxContainer
              .attr('x', this.x(this.data[ChartDatasets.MIN_CRITICAL][0].x))
              .attr('y', this.y(this.data[ChartDatasets.MAX_CRITICAL][1].y))
              .attr('width', this.x(this.data[ChartDatasets.MAX_CRITICAL][1].x) - this.x(this.data[ChartDatasets.MIN_CRITICAL][0].x))
              .attr('height', isNaN(height) ? 0 : height);
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
  public onResized() {
    this.createSVG();
  }
  private createSVG() {
    if (this.svg) {
      d3.selectAll('#baseline-chart > svg').remove();
      d3.selectAll('.tooltip').remove();
    }
    this.height = this.baselineChart.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
    this.width = this.baselineChart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = d3.select(this.baselineChart.nativeElement).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.drawChart();
  }
  private drawChart() {
    this.currentTransform = undefined;
    this.clipContainer = this.svg.append('g')
      .attr('clip-path', 'url(#clip)');
    this.criticalBoxContainer = this.clipContainer.append('g').append('rect')
      .attr('class', 'critical-baseline');
    this.x = d3.scaleLinear()
    .domain(this.xExtent ?? [1, 100])
      .range([0, this.width]);
    this.xAxis = this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`);
    this.y = d3.scaleLinear()
    .domain(this.yExtent ?? [1, 100])
      .range([this.height, 0]);
    this.yAxis = this.svg.append('g');


    this.svg.append('text').attr('transform', `translate(${this.width / 2}, ${this.height + this.margin.bottom - 20})`).style('text-anchor', 'middle').attr('class', 'baseline-label').text('Temporal (days)');
    this.svg.append('text').attr('transform', `rotate(-90)`).attr('y', -this.margin.left + 20).attr('x', -this.height / 2).style('text-anchor', 'middle').attr('class','baseline-label').text('Perpendicular (m)');

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.dotsContainer = this.clipContainer.append('g');
    this.updateCircles();
    this.zoom = d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', (eve: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.currentTransform = eve.transform;
        this.updateChart();
      });


    d3.select('#baseline-chart').selectChild().call(this.zoom);

    this.svg.append('defs').append('SVG:clipPath')
      .attr('id', 'clip')
      .append('SVG:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0);
      if (this.data[ChartDatasets.MIN_CRITICAL].length > 0) {
        this.updateChart();
      }
  }
  private updateChart() {
    const newX = this.currentTransform?.rescaleX(this.x) ?? this.x;
    const newY = this.currentTransform?.rescaleY(this.y) ?? this.y;
    const smallChart = this.width > 400;
    this.xAxis.call(
      d3.axisBottom(newX)
        .tickSize(-this.height)
        .ticks(smallChart ? 10 : 5, 's')
    );
    this.yAxis.call(
      d3.axisLeft(newY)
        .tickSize(-this.width)
        .ticks(smallChart ? 10 : 5, 's')
    );

    this.dotsContainer.selectAll('circle').data(this.data[ChartDatasets.PRODUCTS]).join('circle')
      .attr('cx', d => newX(d.x))
      .attr('cy', d => newY(d.y));
      let height = newY(this.data[ChartDatasets.MIN_CRITICAL][0].y) - newY(this.data[ChartDatasets.MAX_CRITICAL][1].y)
    this.criticalBoxContainer.attr('x', newX(this.data[ChartDatasets.MIN_CRITICAL][0].x))
      .attr('y', newY(this.data[ChartDatasets.MAX_CRITICAL][1].y))
      .attr('width', newX(this.data[ChartDatasets.MAX_CRITICAL][1].x) - newX(this.data[ChartDatasets.MIN_CRITICAL][0].x))
      .attr('height', isNaN(height) ? 0 : height);

      if (this.hoveredElement) {
        this.updateTooltip();
      }
  }
  private updateCircles() {
    const self = this;

    const transformedY = this.currentTransform?.rescaleY(this.y) ?? this.y;
    const transformedX = this.currentTransform?.rescaleX(this.x) ?? this.x;
    this.dotsContainer.selectAll('circle').data(this.data[ChartDatasets.PRODUCTS]).join('circle')
      .attr('cx', d => transformedX(d.x))
      .attr('cy', d => transformedY(d.y))
      .attr('r', (d) => {
        if (d.id === this.data[ChartDatasets.SELECTED][0]?.id) {
          return 10;
        }
        return 5;
      })
      .attr('class', function (d) {
        if (self.data[ChartDatasets.MASTER].length > 0 && self.data[ChartDatasets.MASTER][0]?.id === d.id) {
          return 'baseline-reference';
        } else if (self.data[ChartDatasets.SELECTED].length > 0 && self.data[ChartDatasets.SELECTED][0]?.id === d.id) {
          return 'baseline-selected';
        } else if (self.data[ChartDatasets.DOWNLOADS].some(p => p.id === d.id)) {
          return 'baseline-download';
        } else {
          return 'baseline-base';
        }
      })
      .on('mouseover', function (_event, d: Point) {
        self.hoveredElement = this;
        self.tooltip.interrupt();
        self.tooltip
          .style('opacity', .9);
        d3.select(this).attr('r', 10);
        self.tooltip.html(`${d.x} days, ${d.y} m`);
        self.updateTooltip();
      })
      .on('mouseout', function (_event, d) {
        self.hoveredElement = null;
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
  private updateTooltip() {
    const bounding = this.hoveredElement.getBoundingClientRect();
    const a = bounding.x > document.body.clientWidth - 90;
    this.tooltip.style('left', `${bounding.x + (a ? -120 : 20)}px`)
    .style('top', `${bounding.y - 10}px`);
  }
  private setDataset(dataset: ChartDatasets, data) {
    this.data[dataset] = data;
    if (dataset === ChartDatasets.PRODUCTS || dataset === ChartDatasets.DOWNLOADS) {
      this.updateCircles();
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
    this.xExtent = [min.x - xBuffer, max.x + xBuffer];
    this.x = d3.scaleLinear()
      .domain(this.xExtent)
      .range([0, this.width]);
      this.yExtent = [min.y - yBuffer, max.y + yBuffer];
    this.y = d3.scaleLinear().domain(this.yExtent).range([this.height, 0]);
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
