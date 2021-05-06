import { animate, style, transition, trigger } from '@angular/animations';

export enum Breakpoints {
  FULL = 4,
  MEDIUM = 3,
  SMALL = 2,
  MOBILE = 1,
}

export const menuAnimation = [
  trigger('fadeTransition', [
    transition(':enter', [
      style({opacity: 0}),
      animate('100ms ease-in', style({opacity: 1}))
    ]),
    transition(':leave', [
      style({opacity: 1}),
      animate('100ms ease-out', style({opacity: 0}))
    ])
  ])
];

