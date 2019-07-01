import {BREAKPOINT} from '@angular/flex-layout';

const PRINT_BREAKPOINTS = [{
  alias: 'xs.print',
  suffix: 'XsPrint',
  mediaQuery: 'print and (max-width: 297px)',
  overlapping: false
}];

export const CustomBreakPointsProvider = {
  provide: BREAKPOINT,
  useValue: PRINT_BREAKPOINTS,
  multi: true
};
