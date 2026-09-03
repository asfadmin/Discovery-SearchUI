import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCard } from '@angular/material/card';

import { Breakpoints } from '@models';
import { ScreenSizeService } from '@services';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [MatCard, AsyncPipe],
})
export class LogoComponent {
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  onResetSearch() {
    window.location = '/' as any;
  }
}
