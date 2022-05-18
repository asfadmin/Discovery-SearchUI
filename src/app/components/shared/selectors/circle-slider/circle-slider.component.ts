import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-circle-slider',
  templateUrl: './circle-slider.component.html',
  styleUrls: ['./circle-slider.component.scss']
})
export class CircleSliderComponent implements OnInit, OnChanges {


  @Input() maxValue  = 365;

  @Input() startValue = 0;
  @Input() endValue = 180;

  @Output() newStart = new EventEmitter<number>();
  @Output() newEnd = new EventEmitter<number>();

  @Output() doneSelecting = new EventEmitter<boolean>();

  private svg?: any;
  private width = 300;
  private height = 250;
  private startAngle = 0;
  private endAngle = Math.PI;
  private arc;
  private arcContainer;
  private circumference_r = 100;
  private startDot;
  private endDot;
  constructor() { }

  ngOnInit(): void {
    this.startAngle = this.getAngle(this.startValue);
    this.endAngle = this.getAngle(this.endValue);
    this.createSvg();
    this.drawSlider();
  }
  ngOnChanges(changes: any) {
    if (changes.startValue && changes.endValue) {
      if (changes.startValue.previousValue !== undefined && changes.endValue.previousValue !== undefined) {
        this.startAngle = this.getAngle(changes.startValue.currentValue);
        this.endAngle = this.getAngle(changes.endValue.currentValue);
        this.setAngles();
        this.startDot.attr('cx', this.circumference_r * Math.sin(this.startAngle));
        this.startDot.attr('cy', -this.circumference_r * Math.cos(this.startAngle));
        this.endDot.attr('cx', this.circumference_r * Math.sin(this.endAngle));
        this.endDot.attr('cy', -this.circumference_r * Math.cos(this.endAngle));
      }
    }
  }
  private getAngle(point) {
    const angle = (point - 1) / this.maxValue * 2 * Math.PI;
    return angle > Math.PI * 1.5 ? angle - Math.PI * 2 : angle;
  }
  private createSvg(): void {
    this.svg = d3.select('figure#slider').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }
  private setAngles() {
    if (this.endAngle < this.startAngle) {
      this.arc.endAngle(this.startAngle);
      this.arc.startAngle(this.endAngle + 2 * Math.PI);
    } else {
      this.arc.startAngle(this.startAngle);
      this.arc.endAngle(this.endAngle);
    }
    this.arcContainer.attr('d', this.arc);
  }
  private movePoint(target, event: {x: number, y: number}, _d?: any) {
    const d_from_origin = Math.sqrt(Math.pow(event.x, 2) + Math.pow(event.y, 2));
    const alpha = Math.acos(event.x / d_from_origin);
    d3.select(target)
      .attr('cx', this.circumference_r * Math.cos(alpha))
      .attr('cy', event.y < 0 ? -this.circumference_r * Math.sin(alpha) : this.circumference_r * Math.sin(alpha));
  }
  private drawSlider() {
    const self = this;
    const container = this.svg.append('g');

    container.append('circle')
      .attr('r', this.circumference_r)
      .attr('class', 'circumference');
    container.append('circle').attr('r', this.circumference_r).attr('class', 'circle-notches');
    this.arc = d3.arc().outerRadius(this.circumference_r).innerRadius(this.circumference_r)
      .startAngle(self.startAngle)
      .endAngle(self.endAngle);

    this.arcContainer = container.append('path').attr('d', self.arc)
      .attr('class', 'range ');
    this.setAngles();

    function dragStarted(event: any, _d: any) {
      event.sourceEvent.stopPropagation();
      d3.select(this)
        .classed('dragging', true);
    }

    function getPoint(angle) {
      return Math.floor((angle < 0 ? angle + 2 * Math.PI : angle) / 2 / Math.PI * self.maxValue) + 1;
    }

    function dragged1(event: any, d: any) {
      self.movePoint(this, event, d);
      self.startAngle = (Math.atan2(event.y, event.x) +  Math.PI / 2);
      self.newStart.emit(getPoint(self.startAngle));
      self.setAngles();
    }
    function dragged2(event: any, d: any) {
      self.movePoint(this, event, d);
      self.endAngle = (Math.atan2(event.y, event.x) +  Math.PI / 2);
      self.newEnd.emit(getPoint(self.endAngle));
      self.setAngles();
    }
    function dragEnded(_d: any) {
      d3.select(this)
        .classed('dragging', false);
        self.doneSelecting.emit(true);
    }
    const drag1 = d3.drag()
      .subject(function (d) { return d; })
      .on('start', dragStarted)
      .on('drag', dragged1)
      .on('end', dragEnded);

    const drag2 = d3.drag()
      .subject(function (d) { return d; })
      .on('start', dragStarted)
      .on('drag', dragged2)
      .on('end', dragEnded);
    this.startDot = container.append('g')
      .attr('class', 'dot start')
      .selectAll('circle')
      .data([{
        x: self.circumference_r * Math.sin(self.startAngle),
        y: -self.circumference_r * Math.cos(self.startAngle)
      }])
      .enter().append('circle')
      .attr('r', 10)
      .attr('cx', function (d: any) { return d.x; })
      .attr('cy', function (d: any) { return d.y; })
      .call(drag1);

    this.endDot = container.append('g')
      .attr('class', 'dot')
      .selectAll('circle')
      .data([{
        x: self.circumference_r * Math.sin(self.endAngle),
        y: -self.circumference_r * Math.cos(self.endAngle)
      }])
      .enter().append('circle')
      .attr('r', 10)
      .attr('cx', function (d: any) { return d.x; })
      .attr('cy', function (d: any) { return d.y; })
      .call(drag2, true);
  }

}
