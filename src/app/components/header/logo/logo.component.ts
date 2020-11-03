import { Component, OnInit } from '@angular/core';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  constructor(
    private screenSize: ScreenSizeService
  ) {}

  ngOnInit(): void {
  }

  onResetSearch() {
    window.location = <any>'/';
  }
}
