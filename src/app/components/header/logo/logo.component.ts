import { Component, inject } from '@angular/core';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [NgIf, MatCard, AsyncPipe],
})
export class LogoComponent {
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  onResetSearch() {
    window.location = '/' as any;
  }
}
