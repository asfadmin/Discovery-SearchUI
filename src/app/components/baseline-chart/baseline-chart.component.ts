import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import Chart from 'chart.js';

@Component({
  selector: 'app-baseline-chart',
  templateUrl: './baseline-chart.component.html',
  styleUrls: ['./baseline-chart.component.scss']
})
export class BaselineChartComponent implements OnInit {
  @ViewChild('baselineChart', { static: true }) baselineChart: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.initChart();
  }

  private initChart() {
    const myChart = new Chart(this.baselineChart.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Scatter Dataset',
          data: [
            { x: -10, y: 0 },
            { x: 0, y: 10 },
            { x: 10, y: 5 },
            { x: 10, y: 20 },
            { x: 15, y: 10 }
          ]
        }]
      },
      options: {
        responsive: true,
        zoom: {
          enabled: true,
          mode: 'xy',
          rangeMin: { x: null, y: null },
          rangeMax: { x: null, y: null }
        },
        pan: {
          enabled: true,
          mode: 'xy',
          rangeMin: { x: null, y: null },
          rangeMax: { x: null, y: null }
        },
        scales: {
          xAxes: [{
            type: 'linear',
            position: 'bottom',
            scaleLabel: {
              display: true,
              labelString: 'Temporal (days)'
            }
          }],
          yAxes: [{
            type: 'linear',
            position: 'left',
            scaleLabel: {
              display: true,
              labelString: 'Perpendicular (m)'
            },
            ticks: {
              min: -10,
              max: 10
            }
          }]
        },
        legend: {
          labels: {
            // only show labels for the first three datasets
            filter: (legendItem, chartData) => {
              return (legendItem.datasetIndex < 3);
            }
          }
        },
        chartArea: {
          backgroundColor: 'rgba(0, 0, 0, 0)'
        }
      }}
    );
  }
}
