import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import Chart from 'chart.js';
import { map, tap, filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import { criticalBaselineFor } from '@models';


@Component({
  selector: 'app-baseline-chart',
  templateUrl: './baseline-chart.component.html',
  styleUrls: ['./baseline-chart.component.scss']
})
export class BaselineChartComponent implements OnInit {
  @ViewChild('baselineChart', { static: true }) baselineChart: ElementRef;

  private chart: Chart;
  private criticalBaseline: number;

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.initChart();

    this.store$.select(scenesStore.getAllProducts).pipe(
      tap(products => products.map(
        product => this.criticalBaseline = criticalBaselineFor(product)
      )),
      map(
        products => products.map(product => ({
          x: product.metadata.temporal,
          y: product.metadata.perpendicular,
          id: product.id
        }))
      ),
    ).subscribe(
      points => {
        const { minDataset, maxDataset } = this.criticalBaselineDataset(points);

        this.chart.data.datasets.forEach((dataset) => {
          if (dataset.label === 'Within Critical Baseline') {
            dataset.data = points;
          } else if (dataset.label === 'Min Critical Baseline') {
            dataset.data = minDataset;
          } else if (dataset.label === 'Max Critical Baseline') {
            dataset.data = maxDataset;
          }
        });

        this.chart.update();
      });
  }

  private criticalBaselineDataset(points: {x: number, y: number}[]) {
    const { min, max } = this.determineMinMax(points);

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

  private initChart() {
    const styles = this.chartStyles();

    this.chart = new Chart(this.baselineChart.nativeElement, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Within Critical Baseline',
          data: [],
          ...styles.secondary
        }, {
          label: 'Min Critical Baseline',
          showLine: true,
          type: 'line',
          data: [],
          ...styles.critical
        }, {
          label: 'Max Critical Baseline',
          showLine: true,
          type: 'line',
          data: [],
          ...styles.critical
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
          }]
        },
        legend: {
          labels: {
            filter: (legendItem, chartData) => {
              return (legendItem.datasetIndex < 1);
            }
          }
        },
        chartArea: {
          backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        animation: false,
        elements: {point: {radius: 6, hoverRadius: 9}},
        hoverMode: 'single',
        tooltips: {
          backgroundColor: 'lightgrey',
          bodyFontColor: 'black',
          callbacks: {
            label: (tooltipItem, data) =>
              ` ${tooltipItem.xLabel} days, ${tooltipItem.yLabel} meters`
          }
        },
      }}
    );
  }

  private chartStyles() {
    return {
      critical: {
        pointStyle: 'dash',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderColor: 'white',
        borderWidth: 1,
        fill: 'origin',
      },
      secondary: {
        pointBackgroundColor: 'grey',
        pointBorderColor: 'white',
        borderWidth: 1,
        radius: 5,
        pointHoverBackgroundColor: 'grey',
        pointHoverBorderColor: 'black'
      }
    };
  }
}
