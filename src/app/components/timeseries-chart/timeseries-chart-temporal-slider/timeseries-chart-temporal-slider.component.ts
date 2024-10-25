import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as noUiSlider from 'nouislider';

@Component({
  selector: 'app-timeseries-chart-temporal-slider',
  standalone: true,
  templateUrl: './timeseries-chart-temporal-slider.component.html',
  styleUrls: ['./timeseries-chart-temporal-slider.component.scss']
})
export class TimeseriesChartTemporalSliderComponent implements OnInit {
  @ViewChild('slider', { static: true }) sliderRef: ElementRef;

  constructor() { }

  ngOnInit() {
    this.makeSlider(this.sliderRef);
  }

  public makeSlider(filterRef: ElementRef) {
    noUiSlider.create(filterRef.nativeElement, {
      start: [2000, 2023], // Rango inicial con fechas
      connect: true,
      step: 1,
      tooltips: {
        to: function (value) {
          return Math.round(value).toString(); // Muestra solo el año
        }
      },
      range: {
        'min': 2000,
        'max': 2023
      },
      behaviour: 'tap-drag', // Mejora el comportamiento de arrastre
      orientation: 'horizontal'
    });
  }
}
