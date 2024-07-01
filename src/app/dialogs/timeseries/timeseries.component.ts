import { Component, Inject, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import * as models from '@models';
import * as d3 from 'd3';

@Component({
  selector: 'app-timeseries',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatTableModule, MatIconModule],
  templateUrl: './timeseries.component.html',
  styleUrl: './timeseries.component.scss'
})
export class TimeseriesComponent implements OnInit {
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





  constructor(@Inject(MAT_DIALOG_DATA) public data: models.TimeSeriesResult,
    private dialogRef: MatDialogRef<TimeseriesComponent>,) {
    this.json_data = JSON.stringify(data, null, " ")
    console.log(data)
    for (let i = 0; i < data.time_series.unwrapped_phase.length; i++) {
      this.dataSource.push({
        'position': i,
        'unwrapped_phase': data.time_series.unwrapped_phase[i],
        'interferometric_correlation': data.time_series.interferometric_correlation[i],
        'temporal_coherence': data.time_series.temporal_coherence[0]
      })
    }
    this.averageData = ({
      'position': 'average',
      ...data.averages
    })
  }

  public ngOnInit(): void {


    this.svg = d3.select('#timeseriesChart').append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
      this.drawChart()
    
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
    d3.select('#timeseriesChart').selectChild().call(this.zoom)

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


  public onClose(): void {
    this.dialogRef.close();
  }
}
