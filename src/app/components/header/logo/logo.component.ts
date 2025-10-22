import { Component, inject } from '@angular/core';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
    standalone: false
})
export class LogoComponent {
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  onResetSearch() {
    window.location = '/' as any;
  }
}
