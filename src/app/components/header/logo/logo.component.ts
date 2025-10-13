import { Component, OnInit, inject } from '@angular/core';

import { ScreenSizeService } from '@services';
import { Breakpoints } from '@models';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  private screenSize = inject(ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;

  ngOnInit(): void {
  }

  onResetSearch() {
    window.location = '/' as any;
  }
}
