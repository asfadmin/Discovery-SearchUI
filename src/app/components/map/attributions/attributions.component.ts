import { Component, OnInit, Input } from '@angular/core';

import { LonLat, Breakpoints } from '@models';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss'],
})
export class AttributionsComponent {
  anio: number = new Date().getFullYear();

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  constructor(private screenSize: ScreenSizeService) {}
}
