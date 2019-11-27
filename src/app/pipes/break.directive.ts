import { Directive, Input, ElementRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';


export enum Operators {
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  eq = 'eq',
  ne = 'ne',
}


@Directive({
  selector: '[appBreak]'
})
export class BreakDirective implements OnInit {
  private isDisplayed = true;
  private breakpoint: Breakpoints;
  private selectedBreak = Breakpoints.FULL;
  private op = Operators.eq;

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private screenSize: ScreenSizeService
  ) { }

  ngOnInit() {
    this.screenSize.breakpoint$.pipe(
      tap(breakpoint => this.breakpoint = breakpoint)
    ).subscribe(
      _ => this.update()
    );
  }

  @Input()
  set appBreak(breakpoint: string) {
    this.selectedBreak = this.breakpointNameToNum(breakpoint);

    this.update();
  }

  private breakpointNameToNum(name: string): Breakpoints {
    switch (name) {
      case 'FULL':
        return Breakpoints.FULL;
      case 'MEDIUM':
        return Breakpoints.MEDIUM;
      case 'SMALL':
        return Breakpoints.SMALL;
      case 'MOBILE':
        return Breakpoints.MOBILE;
    }
  }

  @Input()
  set appBreakOp(operator: Operators) {
    this.op = operator;

    this.update();
  }

  private update(): void {
    const shouldDisplay = this.getIsDisplayed();

    if (this.isDisplayed === shouldDisplay) {
      return;
    }

    this.isDisplayed = shouldDisplay;

    if (this.isDisplayed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private getIsDisplayed(): boolean {
    switch (this.op) {
      case Operators.eq: {
        return this.breakpoint === this.selectedBreak;
      }
      case Operators.ne: {
        return this.breakpoint !== this.selectedBreak;
      }
      case Operators.gt: {
        return this.breakpoint > this.selectedBreak;
      }
      case Operators.gte: {
        return this.breakpoint >= this.selectedBreak;
      }
      case Operators.lt: {
        return this.breakpoint < this.selectedBreak;
      }
      case Operators.lte: {
        return this.breakpoint <= this.selectedBreak;
      }
      default: {
        return this.breakpoint === this.selectedBreak;
      }
    }
  }
}
