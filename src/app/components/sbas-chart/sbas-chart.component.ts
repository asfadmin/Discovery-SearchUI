import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as d3 from 'd3';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as uiStore from '@store/ui';

import { SubSink } from 'subsink';
import { ScenesService, PairService } from '@services';
import { CMRProduct } from '@models';

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
  @Input() zoomIn$: Observable<void>;
  @Input() zoomOut$: Observable<void>;
  @Input() zoomToFit$: Observable<void>;

  private hoveredLine;
  private selectedPair = [null, null];
  private scenes: CMRProduct[] = [];
  private isAddingCustomPair: boolean;
  private x;
  private y;
  private xAxis;
  private yAxis;
  private currentTransform;
  private chart;
  private scatter;
  private line;
  private pairs = [];
  private customPairs = [];

  private zoom;
  private zoomBox;

  private queuedProduct;
  private queuedCircle;
  private hoveredCircle;

  private margin;
  private widthValue;
  private heightValue;
  private sbasChartHeightValue;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
    private pairService: PairService,
  ) { }

  ngOnInit(): void {
    const scenes$ = this.scenesService.scenes$();
    const pairs$ = this.pairService.pairs$();

    this.store$.select(scenesStore.getSelectedPair).pipe(
    ).subscribe(
      selected => this.selectedPair = selected
    );

    this.subs.add(
      this.store$.select(uiStore.getIsAddingCustomPoint).pipe(
        tap(_ => this.queuedProduct = null),
      ).subscribe(
        isAddingCustomPair => this.isAddingCustomPair = isAddingCustomPair
      )
    );

    this.subs.add(
      combineLatest(scenes$, pairs$).subscribe(([scenes, pairs]) => {
        this.scenes = scenes;
        this.pairs = pairs.pairs;
        this.customPairs = pairs.custom;

        if (this.selectedPair === null && Array.isArray(this.pairs)) {
          if (this.pairs.length > 0) {
            const firstPair = this.pairs[0];

            this.store$.dispatch(
              new scenesStore.SetSelectedPair(firstPair.map(product => product.id))
            );
          }
        }

        this.makeSbasChart();
      })
    );

    this.zoomOut$.subscribe(_ => {
      this.zoomBox.transition().call(this.zoom.scaleBy, .5);
    });
    this.zoomIn$.subscribe(_ => {
      this.zoomBox.transition().call(this.zoom.scaleBy, 2);
    });
    this.zoomToFit$.subscribe(_ => {
      this.zoomToFit(0);
    });
  }

  public onResized() {
    this.makeSbasChart();
  }

  public makeSbasChart() {
    if (this.chart) {
      d3.selectAll('#sbasChart > svg').remove();
      d3.selectAll('.tooltip').remove();
    }

    this.margin = { top: 10, right: 0, bottom: 25, left: 50 };

    const elem = document.getElementById('sbas-chart-column');
    this.heightValue = elem.offsetHeight;
    const sbasChart = document.getElementById('sbasChart');
    this.sbasChartHeightValue = sbasChart.offsetHeight - (this.margin.bottom + this.margin.top) ;
    this.widthValue = sbasChart.offsetWidth;

    this.chart = d3.select('#sbasChart')
      .append('svg')
        .attr('width', this.widthValue)
        .attr('height', this.heightValue)
      .append('g')
        .attr('transform',
              `translate(${this.margin.left},${this.margin.top})`);

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.chart.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'end')
      .attr('x', (this.widthValue / 2) - 15)
      .attr('y', this.heightValue - (this.margin.top))
      .text('Date');

    this.chart.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'end')
      .attr('y', -this.margin.left)
      .attr('x', -((this.heightValue - (this.margin.top)) / 2) + 60)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Perp. Baseline');

    const xExtent = d3.extent(
      this.scenes.map(
        s => s.metadata.date.valueOf()
      )
    );

    this.x = d3.scaleUtc()
      .domain(xExtent)
      .range([ 0, this.widthValue  * 3 ]);

    this.xAxis = this.chart.append('g')
      .attr('transform', `translate(0, ${this.sbasChartHeightValue})`)
      .attr('class', 'y axis-grid')
      .call(
        d3.axisBottom(this.x)
          .tickSize(-(this.heightValue - (this.margin.bottom + this.margin.top)))
      );

    const yExtent = d3.extent(
      this.scenes.map(
        s => s.metadata.perpendicular)
    );

    this.y = d3.scaleLinear()
      .domain(yExtent)
      .range([this.heightValue - (this.margin.bottom + this.margin.top), 0]);

    this.yAxis = this.chart.append('g')
      .attr('class', 'x axis-grid')
      .call(
        d3.axisLeft(this.y)
          .tickSize(-this.widthValue)
      );

    this.scatter = this.chart.append('g')
      .attr('clip-path', 'url(#clip)');

    this.zoom = d3.zoom()
      .scaleExtent([.2, 10])
      .extent([[0, 0], [this.widthValue, this.heightValue]])
      .on('zoom', _ => {
        this.currentTransform = d3.event.transform;

        this.updateChart();
      });

    // Add brushing
    d3.brushX()
      .extent( [ [0, 0], [this.widthValue, this.heightValue] ] )
      .on('end', this.updateChart);

    this.zoomBox = this.scatter.append('rect')
      .attr('width', this.widthValue)
      .attr('height', this.heightValue - (this.margin.bottom + this.margin.top))
      .attr('cursor', 'pointer')
      .style('fill', 'transparent')
      .style('pointer-events', 'all');

    if (this.currentTransform) {
      this.zoomBox.call(this.zoom.transform, this.currentTransform);
    }

    this.zoomBox.call(this.zoom);

    this.line = d3.line()
      .x((product: any) => this.x(product.metadata.date.valueOf()))
      .y((product: any) => this.y(product.metadata.perpendicular));

    const lines = this.scatter.append('g')
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
    .selectAll('path');

    const self = this;
    const addPairAttributes = (ps) => {
      ps
        .attr('class', 'base-line')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('cursor', 'pointer')
        .attr('d', pair => this.line(pair))
        .on('mouseover', function(_) {
          self.setHovered(d3.select(this));
        })
        .on('mouseleave', function(_) {
          self.clearHovered();
        })
      .on('click', pair => {
        this.store$.dispatch(
          new scenesStore.SetSelectedPair(pair.map(product => product.id))
        );
        this.setSelected(pair);
      });
    };

    addPairAttributes(
      lines
        .data(this.pairs)
        .join('path')
          .style('mix-blend-mode', 'multiply')
    );

    addPairAttributes(
      lines
        .data(this.customPairs)
        .join('path')
          .style('stroke-dasharray', ' 5,5')
    );

    this.scatter.append('g')
      .selectAll('circle')
      .data(this.scenes)
      .enter()
      .append('circle')
        .attr('cx', (d: CMRProduct) => this.x(d.metadata.date.valueOf()) )
        .attr('cy', (d: CMRProduct) => this.y(d.metadata.perpendicular) )
        .on('click', function(p) {
          self.toggleDrawing(p, d3.select(this));
        })
        .on('mouseover', function(p) {
          if (self.isAddingCustomPair) {
            self.setHoveredProduct(d3.select(this));
          }
          const date = p.metadata.date.toDate();

          tooltip
            .style('opacity', .9);
          tooltip.html(`${self.tooltipDateFormat(date)}, ${p.metadata.perpendicular} meters`)
            .style('left', `${d3.event.pageX + 10}px`)
            .style('top', `${d3.event.pageY - 20}px`);
        })
        .on('mouseleave', function(_) {
          if (self.isAddingCustomPair) {
            self.clearHoveredProduct();
          }
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
        })
        .attr('r', 7)
        .attr('cursor', 'pointer')
        .style('fill', 'light grey')
        .style('opacity', 0.7);

    if (this.selectedPair !== null && this.selectedPair[0] !== null && this.selectedPair[1] !== null) {
      this.setSelected(this.selectedPair);
    } else {
      this.scatter.select('.selected-line').remove();
    }

    // Add a clipPath: everything out of this area won't be drawn.
    this.chart.append('defs').append('SVG:clipPath')
      .attr('id', 'clip')
      .append('SVG:rect')
      .attr('width', this.widthValue)
      .attr('height', this.heightValue - (this.margin.bottom + this.margin.top))
      .attr('x', 0)
      .attr('y', 0);

    if (this.currentTransform) {
      this.updateChart();
    } else {
      this.zoomToFit();
    }

  }

  private updateChart() {
    const newX = this.currentTransform.rescaleX(this.x);
    const newY = this.currentTransform.rescaleY(this.y);

    this.xAxis.call(
      d3.axisBottom(newX)
        .tickSize(-(this.heightValue - (this.margin.bottom + this.margin.top)))
    );
    this.yAxis.call(
      d3.axisLeft(newY)
          .tickSize(-this.widthValue)
    );

    this.scatter
      .selectAll('circle')
        .attr('cx', (d: CMRProduct) => newX(d.metadata.date.valueOf()) )
        .attr('cy', (d: CMRProduct) => newY(d.metadata.perpendicular) );

    this.line = d3.line()
        .x((product: any) => newX(product.metadata.date.valueOf()))
        .y((product: any) => newY(product.metadata.perpendicular));

    this.scatter.selectAll('.base-line')
      .attr('d', pair => this.line(pair));

    if (this.selectedPair !== null && this.selectedPair[0] !== null && this.selectedPair[1] !== null) {
      this.setSelected(this.selectedPair);
    }
  }

  private setHoveredProduct(newHovered): void {
    if (this.hoveredCircle) {
      this.hoveredCircle
        .attr('fill', 'black');
    }

    newHovered
      .attr('fill', 'orange');

    this.hoveredCircle = newHovered;
  }

  private clearHoveredProduct(): void {
    this.hoveredCircle
      .attr('fill', 'black');
  }

  private setHovered(newHovered) {
    if (this.hoveredLine) {
      this.hoveredLine
        .style('mix-blend-mode', 'multiply')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3);
    }

    newHovered
      .style('mix-blend-mode', 'normal')
      .attr('stroke', 'orange')
      .attr('stroke-width', 5);

    this.hoveredLine = newHovered;
  }

  private clearHovered() {
    this.hoveredLine
      .style('mix-blend-mode', 'multiply')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 3);
  }

  public setSelected = (pair) => {
    this.selectedPair = pair;

    this.scatter.select('.selected-line').remove();

    this.scatter.append('path')
      .attr('class', 'selected-line')
      .attr('stroke', 'red')
      .attr('stroke-width', 5)
      .attr('cursor', 'pointer')
      .attr('d', _ => this.line(pair));
  }

  private toggleDrawing(product, queuedCircle) {
    if (!this.isAddingCustomPair) {
      return;
    }

    if (!!this.queuedProduct) {
      if (this.queuedProduct.id === product.id) {
        return;
      }

      this.addPair(product);
      this.store$.dispatch(new uiStore.StopAddingCustomPoint());
      this.queuedCircle
        .attr('r', 7)
        .attr('cursor', 'pointer')
        .style('fill', 'light grey')
        .style('opacity', 0.8);
    } else {
      this.queuedProduct = product;
      this.queuedCircle = queuedCircle;

      this.queuedCircle
        .attr('r', 9)
        .attr('cursor', 'pointer')
        .style('fill', 'red')
        .style('opacity', 0.8);
    }
  }

  private addPair(product: CMRProduct) {
    if (this.queuedProduct.id === product.id) {
      return;
    }

    this.store$.dispatch(
      new scenesStore.AddCustomPair([ this.queuedProduct.id, product.id ])
    );
    this.queuedProduct = null;
  }

  private zoomToFit(transitionDuration = 0) {
    const root = this.chart;
    const bounds = root.node().getBBox();
    const parent = root.node().parentElement;
    const fullWidth = parent.clientWidth || parent.parentNode.clientWidth,
      fullHeight = parent.clientHeight || parent.parentNode.clientHeight;
    const width = bounds.width,
      height = bounds.height;
    const midX = bounds.x + width / 2,
      midY = bounds.y + height / 2;
    if (width === 0 || height === 0) { return; } // nothing to fit
    const scale = 0.85 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    const transform = d3.zoomIdentity
      .translate(translate[0], translate[1])
      .scale(scale);

    this.zoomBox
      .transition()
      .duration(transitionDuration || 0) // milliseconds
      .call(this.zoom.transform, transform);
  }

  private tooltipDateFormat(date) {
    function join(t, a, s) {
      function format(m) {
        const f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
      }
      return a.map(format).join(s);
    }

    const dateFormat = [{month: 'short'}, {day: 'numeric'},  {year: 'numeric'}];
    return join(date, dateFormat, ' ');
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
