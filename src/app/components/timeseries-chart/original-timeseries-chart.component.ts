import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as d3 from 'd3';
import { Observable, Subject } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as sceneStore from '@store/scenes';
import * as chartsStore from '@store/charts';
import { SubSink } from 'subsink';
import { AsfLanguageService } from "@services/asf-language.service";

interface TimeSeriesChartPoint {
  unwrapped_phase: number
  interferometric_correlation: number
  temporal_coherence: number
  date: string
  file_name: string,
  temporal_baseline: number
  id: string
}

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrl: './timeseries-chart.component.scss'
})
export class TimeseriesChartComponent implements OnInit, OnDestroy {
  @ViewChild('tsChartWrapper', { static: true }) tsChartWrapper: ElementRef;
  @ViewChild('timeseriesChart', { static: true }) timeseriesChart: ElementRef;
  @Input() zoomIn$: Observable<void>;
  @Input() zoomOut$: Observable<void>;
  @Input() zoomToFit$: Observable<void>;
  @Input() chartData: Subject<any>;

  public json_data: string = '';
  private svg?: d3.Selection<SVGElement, {}, HTMLDivElement, any>;
  public dataSource: TimeSeriesChartPoint[] = [];
  public averageData = {};
  public displayedColumns: string[] = ['position', 'unwrapped_phase', 'interferometric_correlation', 'temporal_coherence']
  private currentTransform: d3.ZoomTransform;
  private zoom: d3.ZoomBehavior<SVGElement, {}>;
  private clipContainer: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;

  private width = 640;
  private height = 400;

  private x: d3.ScaleTime<number, number, never>;
  private y: d3.ScaleLinear<number, number, never>;
  public xAxis: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private yAxis: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private dots: d3.Selection<SVGCircleElement, TimeSeriesChartPoint, SVGGElement, {}>;
  private lineGraph: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private toolTip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  public margin = { top: 10, right: 20, bottom: 60, left: 55 };
  private thing: d3.Selection<SVGGElement, {}, HTMLElement, any>
  private hoveredElement;

  private selectedScene: string;
  private showLines = true;
  private xAxisTitle = '';
  private yAxisTitle = '';

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private language: AsfLanguageService,
  ) { }

  public ngOnInit(): void {

    this.translateChartText();
    this.createSVG();

    this.chartData.subscribe(data => {
      this.initChart(data);
    })

    this.subs.add(
      this.store$.select(sceneStore.getSelectedScene).subscribe(test => {
        this.selectedScene = test.id;
        this.updateChart();

      })
    );

    this.subs.add(
      this.store$.select(chartsStore.getShowLines).subscribe(
        showLines => {
          this.showLines = showLines;
          if (this.showLines) {
            this.lineGraph = this.clipContainer.append("path")
          } else {
            this.lineGraph.remove()
          }
          this.updateChart();
        }
      )
    )

    this.subs.add(
      this.language.translate.onLangChange.subscribe( () => {
          this.language.translate.get('SCENE').subscribe( (translated: string) => {
            console.log(translated);
            this.translateChartText();
            this.createSVG();
          });
        }
      )
    );
  }

  public translateChartText() {
    this.xAxisTitle = this.language.translate.instant('SCENE') + ' ' +
        this.language.translate.instant('DATE');
    this.yAxisTitle = this.language.translate.instant('SHORTWAVE_DISPLACEMENT') + ' (' +
        this.language.translate.instant('METERS') + ')';
  }

  public onZoomIn(): void {
    this.thing.transition().call(this.zoom.scaleBy, 2);
  }

  public onZoomOut(): void {
    this.thing.transition().call(this.zoom.scaleBy, .5);
  }

  public onZoomToFit(): void {
    this.thing.transition().call(this.zoom.transform, d3.zoomIdentity);
  }

  public initChart(data): void {
    this.dataSource = []

    // pre-process data, remove test v_2 files from results
    // won't be necessary in production
    for (let key of Object.keys(data)) {
      if (key.startsWith('v_2_')) {
        delete data[key]
      }
    }

    for (let key of Object.keys(data).filter(x => x !== 'mean')) {
      this.dataSource.push({
        'unwrapped_phase': data[key].unwrapped_phase,
        'interferometric_correlation': data[key].interferometric_correlation,
        'temporal_coherence': data[key].temporal_coherence,
        'date': data[key].secondary_datetime,
        'file_name': data[key].source_file_name,
        'id': key,
        'temporal_baseline': data[key].temporal_baseline
      })
    }
    this.averageData = ({
      ...data.mean
    })

    this.svg.selectChildren().remove();

    this.drawChart();
  }

  private drawChart() {

    // Determine scale extents
    // const marginBottom = 40;
    const unwrapped_phases = this.dataSource.map(p => p['unwrapped_phase'] as number)
    const dates = this.dataSource.map(p => Date.parse(p['date'])).filter(d => !isNaN(d))
    const inner_margins = 1.25
    const min_y = Math.min(...unwrapped_phases) * inner_margins
    const min_x = Math.min(...dates)
    const max_y = Math.max(...unwrapped_phases) * inner_margins
    const max_x = Math.max(...dates)

    // Create scales
    this.x = d3.scaleUtc()
      .domain([min_x, max_x])
      .range([0, this.width])
      .nice()
    this.xAxis = this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`);
    this.y = d3.scaleLinear()
      .domain([min_y, max_y])
      .range([this.height, 0]);
    this.yAxis = this.svg.append('g');
    this.svg.append("g")
      // .attr("transform", `translate(0,${this.height - marginBottom})`)
      .attr("transform", `translate(0,${this.height})`)

    this.clipContainer = this.svg.append('g')
      .attr('clip-path', 'url(#clip)');

    const toolTip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    this.toolTip = toolTip
    this.toolTip.attr('transform', `translate(0, 0)`).style('text-anchor', 'middle').style('z-index', 100).style('opacity', 0)

    // Set up color scale
    const Observable10 = this.swatches();
    console.log(Observable10);

    this.lineGraph = this.clipContainer.append("path");

    const self = this;

    this.dots = this.clipContainer.append('g').selectAll('circle')
      .data(this.dataSource)
      .enter()
      .append('circle')
      .attr('cx', (d: TimeSeriesChartPoint) => this.x(Date.parse(d.date)))
      .attr('cy', (d: TimeSeriesChartPoint) => this.y(d.unwrapped_phase))
      .on('mouseover', function (_event: any, p: TimeSeriesChartPoint) {
        self.hoveredElement = this;
        const date = new Date(p.date)
        toolTip.interrupt();
        toolTip
          .style('opacity', .9);
        toolTip.html(`${self.tooltipDateFormat(date)}, ${p.unwrapped_phase.toFixed(2)} meters`);
        self.updateTooltip();
      })
      .on('mouseleave', function (_) {
        toolTip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .on('click', (_event, d) => {
        this.store$.dispatch(new sceneStore.SetSelectedScene(d.id))
      })
      .attr('class', (d) => {
        if (this.selectedScene === d.id) {
          return 'timeseries-selected';
        } else {
          return 'timeseries-base';
        }
      })
      .attr('r', 5);

    this.zoom = d3.zoom<SVGElement, {}>()
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', (eve: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.currentTransform = eve.transform;
        this.updateChart();
      });
    this.thing = d3.select<HTMLDivElement, {}>('#timeseriesChart').selectChild()
    this.thing.call(this.zoom)

    this.svg.append('defs').append('SVG:clipPath')
      .attr('id', 'clip')
      .append('SVG:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0);

    this.svg.append('text')
      .attr('transform', `translate(${this.width / 2}, ${this.height + this.margin.bottom - 20})`)
      .style('text-anchor', 'middle')
      .attr('class', 'ts-chart-label')
      .text(this.xAxisTitle);

    this.svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('y', -this.margin.left + 20)
      .attr('x', -this.height / 2)
      .style('text-anchor', 'middle')
      .attr('class', 'ts-chart-label')
      .text(this.yAxisTitle);

    this.updateChart();
  }

  private updateChart() {
    const newX = this.currentTransform?.rescaleX(this.x) ?? this.x;
    const newY = this.currentTransform?.rescaleY(this.y) ?? this.y;
    const smallChart = this.width > 400;
    this.xAxis.call(
      d3.axisBottom(newX)
        .tickSize(-this.height)
    );
    this.yAxis.call(
      d3.axisLeft(newY)
        .tickSize(-this.width)
        .ticks(smallChart ? 10 : 5, 's')
    );

    var lineFunction = d3.line<TimeSeriesChartPoint>()
      .x(function (d) { return newX(Date.parse(d.date)); })
      .y(function (d) { return newY(d.unwrapped_phase); })


    this.dots
      .attr('cx', d => newX(Date.parse(d.date)))
      .attr('cy', d => newY(d.unwrapped_phase))
      .attr('class', (d) => {
        if (this.selectedScene === d.id) {
          return 'timeseries-selected';
        } else {
          return 'timeseries-base';
        }
      })
      .on('click', (_event, d) => {
        this.store$.dispatch(new sceneStore.SetSelectedScene(d.id))
      })

    if (this.showLines) {
      this.addPairAttributes(
        this.lineGraph
          .attr('d', _ => lineFunction(this.dataSource))
          .attr('fill', 'none')
      )
    }
  }

  private updateTooltip() {
    const bounding = this.hoveredElement.getBoundingClientRect();
    const a = bounding.x > document.body.clientWidth - 200;
    this.toolTip.style('left', `${bounding.x + (a ? -150 : 20)}px`)
      .style('top', `${bounding.y - 10}px`);
  }

  private addPairAttributes(ps) {
    return ps
      .attr('class', 'base-line')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1)
  };

  public onResized() {
    this.createSVG();
  }

  private createSVG() {
    if (this.svg) {
      d3.selectAll('#timeseries-chart > svg').remove();
      d3.selectAll('.tooltip').remove();
    }

    const element = document.getElementById("timeseriesChart");
    element.innerHTML = '';

    this.height = this.timeseriesChart.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
    this.width = this.timeseriesChart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = d3.select(this.timeseriesChart.nativeElement).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.drawChart();
  }

  private tooltipDateFormat(date) {
    function join(t, a, s) {
      function format(m) {
        const f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
      }
      return a.map(format).join(s);
    }

    const dateFormat = [{ month: 'short' }, { day: 'numeric' }, { year: 'numeric' }];
    return join(date, dateFormat, ' ');
  }

  public swatches() {
    const colors = d3.schemeCategory10
    const n = colors.length;
    const dark = d3.lab(colors[0]).l < 50;

    console.log( colors, n, dark);

    return colors;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
