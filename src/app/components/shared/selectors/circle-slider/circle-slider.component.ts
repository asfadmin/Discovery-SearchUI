import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-circle-slider',
  templateUrl: './circle-slider.component.html',
  styleUrls: ['./circle-slider.component.scss']
})
export class CircleSliderComponent implements OnInit {


  @Input() minValue  = 0;
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
  constructor() { }

  ngOnInit(): void {
    this.startAngle = this.getAngle(this.startValue);
    this.endAngle = this.getAngle(this.endValue);
    this.createSvg();
    this.drawSlider();
  }
  private getAngle(point) {
    return (point - 1) / 365 * 2 * Math.PI;
  }
  private createSvg(): void {
    this.svg = d3.select('figure#slider').append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  }
  private drawSlider() {
    const self = this;
    const circumference_r = 100;
    const container = this.svg.append('g');

    container.append('circle')
      .attr('r', circumference_r)
      .attr('class', 'circumference');

    const arc = d3.arc().outerRadius(circumference_r).innerRadius(circumference_r)
      .startAngle(self.startAngle)
      .endAngle(self.endAngle);
    const thing2 = container.append('path').attr('d', arc)
      .attr('class', 'range ');



    function dragStarted(event: any, _d: any) {
      event.sourceEvent.stopPropagation();
      d3.select(this)
        .classed('dragging', true);
    }

    function setAngles() {
      if (self.endAngle < self.startAngle) {
        arc.endAngle(self.startAngle);
        arc.startAngle(self.endAngle + 2 * Math.PI);
      } else {
        arc.startAngle(self.startAngle);
        arc.endAngle(self.endAngle);
      }
    }
    function movePoint(target, event, d) {
      const d_from_origin = Math.sqrt(Math.pow(event.x, 2) + Math.pow(event.y, 2));

      const alpha = Math.acos(event.x / d_from_origin);
      d3.select(target)
        .attr('cx', d.x = circumference_r * Math.cos(alpha))
        .attr('cy', d.y = event.y < 0 ? -circumference_r * Math.sin(alpha) : circumference_r * Math.sin(alpha));
    }

    function getPoint(angle) {
      return Math.floor((angle < 0 ? angle + 2 * Math.PI : angle) / 2 / Math.PI * 365) + 1;
    }

    function dragged1(event: any, d: any) {
      movePoint(this, event, d);
      self.startAngle =  (Math.atan2(event.y, event.x) +  Math.PI / 2);
      self.newStart.emit(getPoint(self.startAngle));
      setAngles();
      thing2.attr('d', arc);
    }
    function dragged2(event: any, d: any) {
      movePoint(this, event, d);
      self.endAngle =  (Math.atan2(event.y, event.x) +  Math.PI / 2);
      self.newEnd.emit(getPoint(self.endAngle));
      setAngles();
      thing2.attr('d', arc);
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

    container.append('g')
      .attr('class', 'dot start')
      .selectAll('circle')
      .data([{
        x: circumference_r * Math.cos(self.startAngle),
        y: -circumference_r * Math.sin(self.startAngle)
      }])
      .enter().append('circle')
      .attr('r', 10)
      .attr('cx', function (d: any) { return d.x; })
      .attr('cy', function (d: any) { return d.y; })
      .call(drag1);

    container.append('g')
      .attr('class', 'dot')
      .selectAll('circle')
      .data([{
        x: circumference_r * Math.cos(self.endAngle),
        y: -circumference_r * Math.sin(self.endAngle)
      }])
      .enter().append('circle')
      .attr('r', 10)
      .attr('cx', function (d: any) { return d.x; })
      .attr('cy', function (d: any) { return d.y; })
      .call(drag2, true);
  }

}
