import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { map, tap, filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import Chart from 'chart.js';

@Component({
  selector: 'app-baseline-chart',
  templateUrl: './baseline-chart.component.html',
  styleUrls: ['./baseline-chart.component.scss']
})
export class BaselineChartComponent implements OnInit {
  @ViewChild('baselineChart', { static: true }) baselineChart: ElementRef;

  private chart: Chart;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.initChart();

    this.store$.select(scenesStore.getAllProducts).pipe(
      map(
        products => products.map(product => ({
          x: product.metadata.temporal,
          y: product.metadata.perpendicular,
          id: product.id
        }))
      ),
    ).subscribe(
      points => {
        this.chart.data.datasets.forEach((dataset) => {
          if (dataset.label === 'Within Critical Baseline') {
            dataset.data = points;
          }
        });

        this.chart.update();
      }
    );
  }

  private initChart() {
    this.chart = new Chart(this.baselineChart.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Within Critical Baseline',
          data: [],
          pointBackgroundColor: 'grey',
          pointBorderColor: 'white',
          borderWidth: 1,
          radius: 5,
          pointHoverBackgroundColor: 'grey',
          pointHoverBorderColor: 'black'
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
            filter: (legendItem, chartData) => {
              return (legendItem.datasetIndex < 3);
            }
          }
        },
        chartArea: {
          backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        animation: false,
        elements: {point: {radius: 6, hoverRadius: 9}},
        hoverMode: 'single',
      }}
    );
  }
}
