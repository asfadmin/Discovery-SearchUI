import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import * as models from '@models';
import { ScreenSizeService } from '@services';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-circle-slider',
  templateUrl: './circle-slider.component.html',
  styleUrls: ['./circle-slider.component.scss']
})
export class CircleSliderComponent implements OnInit, OnChanges, OnDestroy {


  @Input() maxValue = 365;

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
  private lines: { line: any, angle: number }[] = [];
  private subs = new Subscription();



  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private screenSize: ScreenSizeService,
  ) { }

  ngOnInit(): void {
    this.startAngle = this.getAngle(this.startValue);
    this.endAngle = this.getAngle(this.endValue);
    this.createSvg();
    this.drawSlider();
    this.subs.add(
      this.breakpoint$.subscribe(bp => {
        if (bp === models.Breakpoints.MOBILE) {
          this.startDot.attr('r', 15);
          this.endDot.attr('r', 15);
        } else {
          this.startDot.attr('r', 10);
          this.endDot.attr('r', 10);
        }
      }));

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges) {
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
    } else {
      if (changes.startValue && changes.startValue.currentValue !== this.getPoint(this.startAngle)) {
        this.startAngle = this.getAngle(changes.startValue.currentValue);
        this.startDot.attr('cx', this.circumference_r * Math.sin(this.startAngle));
        this.startDot.attr('cy', -this.circumference_r * Math.cos(this.startAngle));
        this.setAngles();
      }
      if (changes.endValue && changes.endValue.currentValue !== this.getPoint(this.endAngle)) {
        this.endAngle = this.getAngle(changes.endValue.currentValue);
        this.endDot.attr('cx', this.circumference_r * Math.sin(this.endAngle));
        this.endDot.attr('cy', -this.circumference_r * Math.cos(this.endAngle));
        this.setAngles();
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
    let startAngle = this.startAngle < 0 ? this.startAngle + 2 * Math.PI : this.startAngle;
    let endAngle = this.endAngle < 0 ? this.endAngle + 2 * Math.PI : this.endAngle;
    let inverse = false;
    if (endAngle < startAngle) {
      const temp1 = startAngle;
      startAngle = endAngle;
      endAngle = temp1;
      inverse = true;
    }
    for (const line of this.lines) {
      if (inverse) {
        if (line.angle < startAngle || line.angle > endAngle) {
          line.line.attr('class', 'notch selected');
        } else {
          line.line.attr('class', 'notch');
        }
      } else if (startAngle < line.angle &&
        line.angle < endAngle) {
        line.line.attr('class', 'notch selected');
      } else {
        line.line.attr('class', 'notch');
      }
    }
  }
  private movePoint(target, event: { x: number, y: number }, _d?: any) {
    const d_from_origin = Math.sqrt(Math.pow(event.x, 2) + Math.pow(event.y, 2));
    const alpha = Math.acos(event.x / d_from_origin);
    d3.select(target)
      .attr('cx', this.circumference_r * Math.cos(alpha))
      .attr('cy', event.y < 0 ? -this.circumference_r * Math.sin(alpha) : this.circumference_r * Math.sin(alpha));
  }

  private getPoint(angle) {
    return Math.floor((angle < 0 ? angle + 2 * Math.PI : angle) / 2 / Math.PI * this.maxValue) + 1;
  }
  private drawSlider() {
    const self = this;
    const container = this.svg.append('g');

    const sections = 12;
    const sectionSize = Math.PI * 2 / sections;

    for (let i = 0; i < sections; i++) {
      const angle = i * sectionSize;
      const inner_x = (this.circumference_r * 0.9) * Math.sin(angle);
      const inner_y = -(this.circumference_r * 0.9) * Math.cos(angle);
      const outer_x = (this.circumference_r * 1.1) * Math.sin(angle);
      const outer_y = -(this.circumference_r * 1.1) * Math.cos(angle);
      const line = d3.line()([[inner_x, inner_y], [outer_x, outer_y]]);
      const line_container = container.append('path')
        .attr('d', line)
        .attr('class', 'notch');
      self.lines.push({ line: line_container, angle: angle });
    }
    container.append('circle')
      .attr('r', this.circumference_r)
      .attr('class', 'circumference');
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


    function dragged1(event: any, d: any) {
      self.movePoint(this, event, d);
      self.startAngle = (Math.atan2(event.y, event.x) + Math.PI / 2);
      self.newStart.emit(self.getPoint(self.startAngle));
      self.setAngles();
    }
    function dragged2(event: any, d: any) {
      self.movePoint(this, event, d);
      self.endAngle = (Math.atan2(event.y, event.x) + Math.PI / 2);
      self.newEnd.emit(self.getPoint(self.endAngle));
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
