import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NetcdfService } from '@services';

// import * as models from '@models';
import * as d3 from 'd3';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timeseries-chart',
  templateUrl: './timeseries-chart.component.html',
  styleUrl: './timeseries-chart.component.scss'
})
export class TimeseriesChartComponent implements OnInit {
  @ViewChild('timeseriesChart', { static: true }) timeseriesChart: ElementRef;
  @Input() zoomIn$: Observable<void>;
  @Input() zoomOut$: Observable<void>;
  @Input() zoomToFit$: Observable<void>;
  public json_data: string = '';
  private svg?: any;
  public dataSource = [];
  public averageData = {};
  public displayedColumns: string[] = ['position', 'unwrapped_phase', 'interferometric_correlation', 'temporal_coherence']
  private currentTransform;
  private zoom;
  private clipContainer;
  private width = 640;
  private height = 400;
  private x;
  private y;
  private xAxis;
  private yAxis;
  private dots;
  private margin = { top: 10, right: 30, bottom: 60, left: 20 };
  private thing




  constructor(private netcdfService: NetcdfService) {
  }

  public ngOnInit(): void {


    // this.svg = d3.select('#timeseriesChart').append('svg')
    //   .attr('width', this.width + this.margin.left + this.margin.right)
    //   .attr('height', this.height + this.margin.top + this.margin.bottom)
    //   .append('g')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    //   this.drawChart();
    this.createSVG();

    this.netcdfService.getTimeSeries({'lon': 0, 'lat': 0}).subscribe(data => {
      this.initChart(data);
    })
    this.zoomOut$.subscribe(_ => {
      this.thing.transition().call(this.zoom.scaleBy, .5);
    });
    this.zoomIn$.subscribe(_ => {
      this.thing.transition().call(this.zoom.scaleBy, 2);
    });
  }

  public initChart(data): void {

    for(let key of Object.keys(data)) {
      this.dataSource.push({
        'unwrapped_phase': data[key].unwrapped_phase,
        'interferometric_correlation': data[key].interferometric_correlation,
        'temporal_coherence': data[key].temporal_coherence,
        'date': data[key].time
      })
    }
    this.averageData = ({
      ...data.mean
    })
    this.svg.selectChildren().remove();

    this.drawChart();
  }


  private drawChart() {
    const marginBottom = 40;

    this.x = d3.scaleLinear()
    .domain([1, 100])
      .range([0, this.width]);
    this.xAxis = this.svg.append('g')
      .attr('transform', `translate(0, ${this.height})`);
    this.y = d3.scaleLinear()
    .domain([1, 100])
      .range([this.height, 0]);
    this.yAxis = this.svg.append('g');
    this.svg.append("g")
      .attr("transform", `translate(0,${this.height - marginBottom})`)


    this.clipContainer = this.svg.append('g')
      .attr('clip-path', 'url(#clip)');
      this.dots = this.clipContainer.append('g');
      this.updateCircles();
    this.zoom = d3.zoom()
      .extent([[0, 0], [this.width, this.height]])
      .on('zoom', (eve: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        this.currentTransform = eve.transform;
        this.updateChart();
      });
      this.thing = d3.select('#timeseriesChart').selectChild()
    this.thing.call(this.zoom)

    this.svg.append('defs').append('SVG:clipPath')
      .attr('id', 'clip')
      .append('SVG:rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('x', 0)
      .attr('y', 0);
    this.updateChart();
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

    this.dots.selectAll('circle').data(this.dataSource).join('circle')
      .attr('cx', d => newX(d.unwrapped_phase ))
      .attr('cy', d => newY(d.interferometric_correlation));

  }

  private updateCircles() {

    const transformedY = this.currentTransform?.rescaleY(this.y) ?? this.y;
    const transformedX = this.currentTransform?.rescaleX(this.x) ?? this.x;
    this.dots.selectAll('circle').data(this.dataSource).join('circle')
      .attr('cx', d => {return transformedX(d.unwrapped_phase)})
      .attr('cy', d => transformedY(d.interferometric_correlation))
      .attr('r', 5)
      .attr('class', 'timeseries-base')
  }

  public updateAxis(_axis, _value) {

  }

  public onResized() {
    // this.createSVG();
  }

  private createSVG() {
    if (this.svg) {
      d3.selectAll('#timeseries-chart > svg').remove();
      d3.selectAll('.tooltip').remove();
    }
    this.height = this.timeseriesChart.nativeElement.offsetHeight - this.margin.top - this.margin.bottom;
    this.width = this.timeseriesChart.nativeElement.offsetWidth - this.margin.left - this.margin.right;
    this.svg = d3.select(this.timeseriesChart.nativeElement).append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.drawChart();

  }

}
