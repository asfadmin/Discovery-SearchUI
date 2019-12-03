import { Directive, Input, ElementRef, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { tap, map } from 'rxjs/operators';

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

function breakpointNameToNum(name: string): Breakpoints {
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

function getIsDisplayed(op, breakpoint, selectedBreak): boolean {
  switch (op) {
    case Operators.eq: {
      return breakpoint === selectedBreak;
    }
    case Operators.ne: {
      return breakpoint !== selectedBreak;
    }
    case Operators.gt: {
      return breakpoint > selectedBreak;
    }
    case Operators.gte: {
      return breakpoint >= selectedBreak;
    }
    case Operators.lt: {
      return breakpoint < selectedBreak;
    }
    case Operators.lte: {
      return breakpoint <= selectedBreak;
    }
    default: {
      return breakpoint === selectedBreak;
    }
  }
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
      tap(breakpoint => this.breakpoint = breakpoint),
      map(_ => getIsDisplayed(this.op, this.breakpoint, this.selectedBreak))
    ).subscribe(
      shouldDisplay => this.update(shouldDisplay, this.viewContainer)
    );
  }

  @Input()
  set appBreak(breakpoint: string) {
    this.selectedBreak = breakpointNameToNum(breakpoint);
    const shouldDisplay = getIsDisplayed(this.op, this.breakpoint, this.selectedBreak);

    this.update(shouldDisplay, this.viewContainer);
  }

  private update(shouldDisplay: boolean, viewContainer): void {
    if (this.isDisplayed === shouldDisplay) {
      return;
    }

    this.isDisplayed = shouldDisplay;

    this.isDisplayed ?
      viewContainer.createEmbeddedView(this.templateRef) :
      viewContainer.clear();
  }
}
