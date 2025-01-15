import {Component, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation} from '@angular/core';
import * as d3 from 'd3';
// import * as models from '@models';
import {
  debounceTime, distinctUntilChanged, map, Observable, withLatestFrom,
  // Subject
} from 'rxjs';

import { Store } from '@ngrx/store';
import * as filtersStore from '@store/filters';
import { AppState } from '@store';
// import * as sceneStore from '@store/scenes';
import * as chartsStore from '@store/charts';
import { SubSink } from 'subsink';
import { AsfLanguageService } from "@services/asf-language.service";
import { NetcdfService } from '@services';
import * as models from '@models';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import * as uiStore from '@store/ui';
// import {hidden} from '@services/map/polygon.style';
// import {style} from '@angular/animations';
import {linearRegression, linearRegressionLine} from './regression-line'
import {types} from 'sass';


interface TimeSeriesFit {
  seriesNumber: number,
  color: string,
  formula: string
}

interface DataReady {
  name: string,
  values: models.TimeSeriesData[],
  opacity: number,
  color: string,
}

const unSelectedColor = '#9F9F9F9F';

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrl: './timeseries-chart.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TimeseriesChartComponent implements OnInit, OnDestroy {
  // @ViewChild(CdkVirtualScrollViewport) scroll: CdkVirtualScrollViewport;
  scrollIndex = 1;
  @ViewChildren(CdkVirtualScrollViewport)
  viewPorts: QueryList<CdkVirtualScrollViewport>
  @ViewChild('tsChartWrapper', { static: true }) tsChartWrapper: ElementRef;
  @ViewChild('timeseriesChart', { static: true }) timeseriesChart: ElementRef;
  @ViewChild('tsBestFitFormulas', { static: true }) tsBestFitFormulas: ElementRef;
  // @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @Input() zoomIn$: Observable<void>;
  @Input() zoomOut$: Observable<void>;
  @Input() zoomToFit$: Observable<void>;

  // @Input() chartData: models.timeseriesChartItemState[];

  // public scrollIndex = 1;
  // public viewPorts: QueryList<CdkVirtualScrollViewport>;


  public json_data: string = '';
  private svg?: d3.Selection<SVGElement, {}, HTMLDivElement, any>;
  public dataSource: models.TimeSeriesChartPoint[] = [];
  public dataReadyForChart: DataReady[] = [];
  public timeSeriesData: models.TimeSeriesData[] = [];
  public averageData = {};
  public displayedColumns: string[] = ['position', 'short_wavelength_displacement', 'interferometric_correlation', 'temporal_coherence']
  private currentTransform: d3.ZoomTransform;
  private zoom: d3.ZoomBehavior<SVGElement, {}>;
  private clipContainer: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;

  private width = 640;
  private height = 400;

  private x: d3.ScaleTime<number, number, never>;
  private y: d3.ScaleLinear<number, number, never>;
  public xAxis: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private yAxis: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private dots: d3.Selection<SVGCircleElement, models.TimeSeriesData, SVGGElement, {}>;
  private lineGraph: d3.Selection<SVGGElement, {}, HTMLDivElement, any>;
  private toolTip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  public margin = { top: 10, right: 30, bottom: 60, left: 65 };
  private thing: d3.Selection<SVGGElement, {}, HTMLElement, any>
  private hoveredElement;
  public hoveredData;
  public hoveredDate;
  public data: any;
  private lines;
  private points;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public lastStartDate: Date = new Date();
  public lastEndDate: Date = new Date();
  public items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  public formulaOverflow = false;
  private flightDirection = models.FlightDirection.ASCENDING;
  // Tyler this is where you would put the series and their best fit formulas
  public bestFitItems: TimeSeriesFit[] = [

  ];
  private linearFitLine;
  private showLinearFit = false;

  public exportableData: { [index:string]: {}[]} = {}


  // private selectedScene: string;
  @Input() isLoading: boolean = true;
  private showLines = true;
  private xAxisTitle = '';
  private yAxisTitle = '';

  private subs = new SubSink();
  // private allGroup: string[];
  private baseData: models.TimeSeriesData;

  constructor(
    private store$: Store<AppState>,
    private language: AsfLanguageService,
    private netcdfService: NetcdfService

  ) { }

  public ngOnInit(): void {

    this.translateChartText();
    this.createSVG();

    this.subs.add(
      this.store$.select(chartsStore.getIsChartOutOfDate).subscribe(

      )
    )

    this.subs.add(
      this.netcdfService.cacheUpdated.pipe(
        debounceTime(1000),
        withLatestFrom(this.store$.select(chartsStore.getTimeseriesChartStates))
      ).subscribe(([_updated_id, chartStates]) => {
        this.isLoading = false;
        this.refreshChart(chartStates);
      }));

    this.subs.add(
      this.store$.select(chartsStore.getTimeseriesChartStates).subscribe(
        chartStates => {
          this.refreshChart(chartStates);
        }
      )
    );

    this.subs.add(
      this.store$.select(chartsStore.getShowLines).subscribe(
        showLines => {
          this.showLines = showLines;
          if (this.showLines) {
            // this.pointGraph = this.clipContainer.append("pointGraph")
            this.lineGraph = this.clipContainer.append("path");
            this.formulaOverflow = true;
          } else {
            this.lineGraph.remove();
          }
          this.initChart(this.data);
        }
      )
    );

    this.subs.add(
      this.store$.select(chartsStore.getShowLinearFit).subscribe(
        showLinearFit => {
          this.showLinearFit = showLinearFit;
          this.initChart(this.data);
        }
      )
    )

    this.subs.add(
      this.language.translate.onLangChange.subscribe(() => {
        this.language.translate.get('SCENE').subscribe((_translated: string) => {
          this.translateChartText();
          this.createSVG();
        });
      }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getStartDate).subscribe(
        start => {
          this.startDate = start;
          if (this.lastStartDate !== this.startDate) {
            this.lastStartDate = this.startDate;
            this.initChart(this.data);
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getEndDate).subscribe(
        end => {
          this.endDate = end;
          if (this.lastEndDate !== this.endDate) {
            this.lastEndDate = this.endDate;
            this.initChart(this.data);
          }
        }
      )
    );

    this.subs.add(
      this.store$.select(filtersStore.getFlightDirections).pipe(
        map(dir => dir[0] ?? this.flightDirection)
      ).subscribe(
        dir => this.flightDirection = dir
      )
    )

    this.subs.add(
      this.store$.select(chartsStore.getTimeseriesReference).subscribe(
        data => {
          this.baseData = data;
          this.initChart(this.data);
        }
      )
    )

    this.subs.add(
      this.store$.select(uiStore.getActiveWkt).pipe(distinctUntilChanged()).subscribe(wkt => {
        if (wkt)
          this.highlightSeries(wkt);
        else
          this.resetHighlight()
      }));


  }

  private refreshChart(chartStates: { [key: string]: models.timeseriesChartItemState }): void {
    const cache = this.netcdfService.getCache(this.flightDirection)

    const allPointsData: { point: {}, state: models.timeseriesChartItemState }[] = Object.keys(chartStates)
    .filter(
      wkt => chartStates[wkt].valid
    )
    .map(
      wkt => ({ point: cache[wkt], state: chartStates[wkt] })
    );
    if(this.baseData) {
      const missingBaseSeries = Object.keys(chartStates).findIndex(
        wkt => {return chartStates[wkt].seriesNumber === this.baseData.seriesNumber});
      if(missingBaseSeries === -1) {
        this.baseData = null;
      }
    }
    this.data = allPointsData;
    this.initChart(this.data)
  }

  public isOverflowing(): boolean {
    return (this.bestFitItems.length > 5);
  }

  public translateChartText() {
    this.xAxisTitle = this.language.translate.instant('SCENE') + ' ' +
      this.language.translate.instant('DATE');
    this.yAxisTitle = this.language.translate.instant('SHORTWAVE_DISPLACEMENT') + ' (' +
      this.language.translate.instant('METERS') + ')';
  }

  public onButtonClickPlus() {
    this.viewPorts
      .toArray()
      .forEach((el) => el.scrollToIndex(this.scrollIndex, 'smooth'));
    //this.viewPort.scrollToIndex(100, 'smooth');
    this.scrollIndex += 1;
  }

  onButtonClickMinus() {
    if (this.scrollIndex <= 2) {
      this.scrollIndex = 1;
    }
    this.scrollIndex -= 1;
    this.viewPorts
      .toArray()
      .forEach((el) => el.scrollToIndex(this.scrollIndex, 'smooth'));
    //this.viewPort.scrollToIndex(100, 'smooth');
  }

  public onZoomIn(): void {
    this.thing.transition().call(this.zoom.scaleBy, 2);
    this.updateChart();
  }

  public onZoomOut(): void {
    this.thing.transition().call(this.zoom.scaleBy, .5);
    this.updateChart();
  }

  public onZoomToFit(): void {
    this.thing.transition().call(this.zoom.transform, d3.zoomIdentity);
    this.updateChart();
  }

  public initChart(data: {point: {}, state: models.timeseriesChartItemState}[]): void {
    this.dataSource = []
    this.dataReadyForChart = []
    this.exportableData = {}
    if (data?.[Symbol.iterator]) {
      let aoi: string = '';
        for (let result of data) {
          aoi = '';
          // pre-process data, remove test v_2 files from results
          // won't be necessary in production
          if (!!result.point)  {
            for (let key of Object.keys(result.point)) {
              if (key.startsWith('v_2_')) {
                delete result.point[key];
              }
              if (key.startsWith('aoi')) {
                aoi = result.point[key];
              }
            }
            this.timeSeriesData = [];
            for (let key of Object.keys(result.point).filter(x => x !== 'mean' && x !== 'aoi')) {
              let daDate = new Date(result.point[key].secondary_datetime).valueOf();
              if (daDate < this.startDate?.valueOf() || daDate > this.endDate?.valueOf()) { continue; }
              this.dataSource.push({
                'aoi': aoi,
                'short_wavelength_displacement': result.point[key].short_wavelength_displacement,
                'interferometric_correlation': result.point[key].interferometric_correlation,
                'temporal_coherence': result.point[key].temporal_coherence,
                'date': result.point[key].secondary_datetime,
                'file_name': key,
                'id': key,
                'temporal_baseline': result.point[key].temporal_baseline,
              })
              this.timeSeriesData.push({
                'short_wavelength_displacement': result.point[key].short_wavelength_displacement - (this.baseData?.base ?? 0),
                'date': result.point[key].secondary_datetime,
                'seriesNumber': result.state.seriesNumber,
                'color': result.state.color,
                'base': result.point[key].short_wavelength_displacement,
                'id': key + result.point[key].short_wavelength_displacement,
              });

              if (result.state.checked) {
                const series_key = result.state.seriesNumber.toString()
                if (!!!this.exportableData[series_key]) {
                  this.exportableData[series_key] = []
                }
                const slice = {
                  'short_wavelength_displacement': result.point[key].short_wavelength_displacement - (this.baseData?.base ?? 0),
                  'date': result.point[key].secondary_datetime,
                  'wkt': aoi,
                  'fileName': key,

                }
                this.exportableData[series_key].push(slice)
              }
          }
          this.timeSeriesData.sort((a, b) => {
            if(a.date < b.date) {
              return -1
            } else {
              return 1
            }
        })
          this.dataReadyForChart.push({
            name: aoi,
            values: this.timeSeriesData,
            color: result.state.color,
            opacity:  result.state.checked ? 1.0 : 0.2,
          });
        }
      }
    } else {
      this.dataSource = [];
      this.averageData = {};
    }

    this.drawChart();
  }

  private drawChart() {

    this.svg.selectChildren().remove();

    // Determine scale extents
    // const marginBottom = 40;
    const short_wavelength_displacements = this.dataSource.map(p => Math.round(((p['short_wavelength_displacement'] as number)
                                                                    + Number.EPSILON) * 10000) / 10000);
    // const short_wavelength_displacements = this.dataSource.map(p => p['short_wavelength_displacement'] as number)
    const dates = this.dataSource.map(p => Date.parse(p['date'])).filter(d => !isNaN(d))
    const inner_margins = 1.25
    const min_y = Math.min(...short_wavelength_displacements) * inner_margins
    const min_x = Math.min(...dates)
    const max_y = Math.max(...short_wavelength_displacements) * inner_margins
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
      .range([this.height, 0])
      .nice();
    this.yAxis = this.svg.append('g');
    this.svg.append("g")
      // .attr("transform", `translate(0,${this.height - marginBottom})`)
      .attr("transform", `translate(0,${this.height})`)

    this.svg.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('y', -this.margin.left + 12)
      .attr('x', -this.height / 2)
      .style('text-anchor', 'middle')
      .attr('class', 'ts-chart-label')
      .text(this.yAxisTitle);

    this.clipContainer = this.svg.append('g')
      .attr('clip-path', 'url(#clip)');

    const toolTip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    if (this.toolTip) {
      this.toolTip.remove();
    }
    this.toolTip = toolTip
    this.toolTip.attr('transform', `translate(0, 0)`).style('text-anchor', 'middle').style('z-index', 100).style('opacity', 0)

    // this.allGroup = [...new Set(this.dataReadyForChart.map(d => d.name))];

    // this.pointGraph = this.clipContainer.append("pointGraph");
    this.lineGraph = this.clipContainer.append("path");

    const self = this;

    this.points = this.dataSource.map((d) => [this.x(new Date(d.date)), this.y(d.short_wavelength_displacement), d.aoi]);
    // this.points = this.dataSource.map((d) =>  [this.x(new Date(d.date)),
    //                                           Math.round((this.y(d.short_wavelength_displacement) + Number.EPSILON) * 10000) / 10000,
    //                                           d.aoi]);

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

    if (this.dataSource.length <= 0) {
      this.svg.append('rect')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('x', 0)
        .attr('y', 0)
        .attr('class', 'loading-rect');
    }

    this.svg.append('text')
      .attr('transform', `translate(${this.width / 2}, ${this.height + this.margin.bottom - 20})`)
      .style('text-anchor', 'middle')
      .attr('class', 'ts-chart-label')
      .text(this.xAxisTitle);

    this.svg
      .on("pointermove", () => this.pointerMoved(event, this.lines, this.dots, this.points))
      .on("pointerenter", () => this.pointerEntered(this.lines, this.dots))
      .on("pointerleave", () => this.pointerLeft(this.lines, this.dots))
      .on("touchstart", event => event.preventDefault());

    // Add the lines
    if (this.showLines) {

      let line = d3.line<models.TimeSeriesData>()
        .x(function (d) { return self.x(Date.parse(d.date)); })
        .y(function (d) { return self.y(d.short_wavelength_displacement); })

      this.lines = this.svg.append('g')
        .attr('id', 'linesParent')
        .selectAll('myLines')
        .data(this.dataReadyForChart)
        .enter()
        .append('path')
        .attr('clip-path', 'url(#clip)')
        .attr('d', function (d) { // @ts-ignore
          return line(d.values)
        })
        // @ts-ignore
        .attr('stroke', function (d: DataReady) { return d.color })
        .style('opacity', (d: DataReady) => d.opacity)
        .style('stroke-width', 1)
        .style('fill', 'none')
        .style('shape-rendering', 'geometricprecision')
    }

    // add the dots
    this.dots = this.svg.append('g')
      .attr('id', 'dotsParent')
      .attr('class', 'dotsParent')
      .selectAll('myDots')
      .data(this.dataReadyForChart)
      .enter()
      .append('g')
      .attr('clip-path', 'url(#clip)')
      .style('fill', (d) : string=>  { return d.color })
      .style('opacity', (d) => d.opacity)
      .attr('class', (d): string => { return d.name.replace(/\W/g, '') + ' dotsChildren' })
      .selectAll('circle')
      .data(d => d.values)
      .enter()
      .append('circle')
      .attr('cx', (d) => this.x(Date.parse(d.date)))
      .attr('cy', (d) => this.y(d.short_wavelength_displacement))
      .attr('class', (d): string => {
        if (this.baseData && this.baseData.id === d.id) {
          return 'ts-reference-point'
        }
      })
      .on('mouseover', function (_event: any, p: models.TimeSeriesData) {
        self.hoveredElement = this;
        self.hoveredData = p;
        self.hoveredDate = new Date(p.date);
        toolTip.interrupt();
        toolTip
          .style('opacity', .9);
        toolTip.html(`<div style="text-align: left">
      ${self.tooltipDateFormat(self.hoveredDate)},
      ${p.short_wavelength_displacement.toFixed(4)} ${self.language.translate.instant('METERS')} <br>
      <b>${self.language.translate.instant('SERIES')} ${p.seriesNumber}</b></div>`);
        self.updateTooltip();
      })
      .on('mouseleave', function (_) {
        self.hoveredData = null;
        self.hoveredDate = null;
        toolTip.transition()
          .duration(500)
          .style('opacity', 0);
      })
      .attr('r', 5);
      this.bestFitItems = [];
      if(this.dataReadyForChart.length > 0 && this.showLinearFit) {
        this.linearFitLine = this.svg.append('g')
          .attr('id', 'linesParent2')
          .attr('clip-path', 'url(#clip)')
        for(let linearFitData of this.dataReadyForChart) {

          let regression = linearRegression(linearFitData.values.map((x,i) => [i, x.short_wavelength_displacement]));
          this.bestFitItems.push({
            seriesNumber: linearFitData.values[0].seriesNumber,
            color: linearFitData.values[0].color,
            formula: `y = ${regression.m.toFixed(4)}x ${regression.b < 0 ? '-' : '+'} ${Math.abs(regression.b).toFixed(4)}`
          })
          let lineregression = linearRegressionLine(regression);

          let line = d3.line()
            .x((d) => { return this.x(d[0]) })
            .y((d) => { return this.y(d[1]) });
          this.linearFitLine.append("path")
            .datum([regression.m, regression.b])
            .attr("d", (_d) => {
              return line([
                [this.x.domain()[0].getTime(), lineregression(0)], [this.x.domain()[1].getTime(), lineregression(1)]])
            })
          .attr("stroke", linearFitData.color)
          .style("stroke-width", 1)
          .attr('stroke-dasharray', '4')
          .style("fill", "none")
          .style("shape-rendering", "geometricprecision");
        }
      }
    this.updateChart();
  }

  public setReference(reference) {
    this.store$.dispatch(chartsStore.setReferenceData({data:reference}))
  }

  private highlightSeries(wkt) {
    let colorName: string;
    let dClassName: string;
    this.lines.style('stroke', (d: DataReady) => {
      if (d.name === wkt) {
        dClassName = '.' + d.name.replace(/\W/g, '');
        colorName = d.color;
        this.store$.dispatch(new uiStore.SetActiveWkt(d.name));
        return colorName;
      }
      return unSelectedColor;
    });

    // increase width of selected series
    this.lines.style('stroke-width', (d: DataReady) => {
      if (d.name === wkt) {
        return 2;
      }
      return 1;
    });

    // sort the lines so that the selected series is on top
    this.lines.sort(function (a, _b) {
      if (a.dname === wkt) return 1;
      else return -1;
    });

    this.svg.selectAll('circle').style("fill", unSelectedColor).attr('r', 5);
    this.svg.selectAll(dClassName + ' ' + 'circle').style("fill", colorName).attr('r', 6);
    this.svg.selectAll('.dotsChildren').sort(function (a, _b) {
      // @ts-ignore
      if (a.name === wkt) return 1;
      else return -1;
    });
    this.dots.select("text").text(wkt);

  }
  private resetHighlight() {
    let dClassName: string;
    this.lines.style("stroke", (d: DataReady) => {
      dClassName = '.' + d.name.replace(/\W/g, '');
      this.svg.selectAll(dClassName + ' ' + 'circle').style("fill", d.color).attr('r', 5);
      return d.color;
    });
    this.lines.style("stroke-width", 1);
  }

  // When the pointer moves, find the closest point, update the interactive tip, and highlight
  // the corresponding line.
  private pointerMoved(event, _lines, dots, points) {
    this.dots = dots;
    if (typeof points === 'undefined') { return; }
    if (points == null) { return; }
    const [xm, ym] = d3.pointer(event);
    const i = d3.leastIndex(points, ([x, y]) => Math.hypot(Number(x) - xm, Number(y) - ym));
    if (typeof points[i] === 'undefined') { return; }
    const [_x, _y, k] = points[i];
    return;
    // TODO: Fix this to grab the correct series all the time.
    this.highlightSeries(k);
  }

  private pointerEntered(lines, dots) {
    return
    lines.style("mix-blend-mode", null).style("stroke", unSelectedColor);
    dots.attr("display", null);
  }

  private pointerLeft(lines, _dots) {
    return
    let dClassName: string;
    lines.style("stroke", (d: DataReady) => {
      dClassName = '.' + d.name.replace(/\W/g, '');
      this.svg.selectAll(dClassName + ' ' + 'circle').style("fill", d.color).attr('r', 5);
      return d.color;
    });
    lines.style("stroke-width", 1);
    this.store$.dispatch(new uiStore.SetActiveWkt(null));
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
        .ticks(smallChart ? 5 : 2, '.1f')
        .tickFormat(
          (val: number, _index) => `${val}m`
        )
    );

    this.dots
      .attr('cx', d => newX(Date.parse(d.date)))
      .attr('cy', d => newY(d.short_wavelength_displacement))

    const line = d3.line<models.TimeSeriesData>()
      .x(function (d) { return newX(Date.parse(d.date)); })
      .y(function (d) { return newY(d.short_wavelength_displacement); })

    this.lines
      .attr("d", function (d) { // @ts-ignore
        return line(d.values)
      })
      .style('opacity', (d: DataReady) => d.opacity)

    if(this.linearFitLine && this.showLinearFit) {
      let line2 = d3.line()
      .x( (d) => { return newX(d[0]) })
      .y( (d) =>  { return newY(d[1]) });
      this.linearFitLine.selectChildren().each(function () {
        d3.select(this).attr('d', (d: Array<any>) => {

          let lineregression = linearRegressionLine({ m: d[0], b: d[1] });
          return line2([
            [newX.domain()[0].getTime(), lineregression(0)], [newX.domain()[1].getTime(), lineregression(1)]])
        });
      })
    }

  }

  private updateTooltip() {
    const bounding = this.hoveredElement.getBoundingClientRect();
    const a = bounding.x > document.body.clientWidth - 200;
    this.toolTip.style('left', `${bounding.x + (a ? -150 : 20)}px`)
      .style('top', `${bounding.y - 10}px`);
  }

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

  public tooltipDateFormat(_date) {
    if (!_date) { return; }
    function join(t, a, s) {
      function format(m) {
        const f = new Intl.DateTimeFormat('en', m);
        return f.format(t);
      }
      return a.map(format).join(s);
    }

    const dateFormat = [{ month: 'short' }, { day: 'numeric' }, { year: 'numeric' }];
    return join(_date, dateFormat, ' ');
  }

  public resetBasePoint() {
    this.store$.dispatch(chartsStore.resetReferenceData())
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  protected readonly Date = Date;

  protected readonly length = length;
  protected readonly types = types;
  protected readonly Number = Number;
}
