import { Injectable } from '@angular/core';

import Chart from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor() { }

  makeChart(element, hoverCallback, selectCallback) {
    const styles = this.chartStyles();

    return new Chart(element, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Master Scene',
          data: [],
          ...styles.master
        }, {
          label: 'Selected',
          data: [],
          ...styles.selected
        }, {
          label: 'Within Critical Baseline',
          data: [],
          ...styles.scenes
        }, {
          label: 'Scenes',
          data: [],
          ...styles.scenes
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
              return (legendItem.datasetIndex < 3);
            }
          }
        },
        chartArea: {
          backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        animation: false,
        elements: {point: {radius: 6, hoverRadius: 9}},
        onClick: selectCallback,
        tooltips: {
          mode: 'single',
          backgroundColor: 'lightgrey',
          bodyFontColor: 'black',
          callbacks: {
            label: (tooltipItem, data) => {
              hoverCallback(tooltipItem, data);

              const [x, y] = [
                tooltipItem.xLabel, tooltipItem.yLabel
              ].map(Math.floor);

              return ` ${x} days, ${y} meters`;
            }
          }
        },
      }}
    );
  }

  private chartStyles() {
    return {
      master: {
        backgroundColor: 'black',
        borderColor: 'white',
        pointBackgroundColor: 'black',
        pointBorderColor: 'rgba(0,0,0,0)',
        pointHoverBackgroundColor: 'black',
        pointHoverBorderColor: 'rgba(0,0,0,0)'
      },
      critical: {
        pointStyle: 'dash',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderColor: 'white',
        borderWidth: 1,
        fill: 'origin',
      },
      selected: {
        pointRadius: 7,
        pointBorderWidth: 6,
        backgroundColor: 'red',
        pointBorderColor: 'red',
        pointBackgroundColor: 'red',
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red'
      },
      scenes: {
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
