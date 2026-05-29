import { Component, inject } from '@angular/core';

import { MatCard } from '@angular/material/card';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@services';
import * as models from '@models';
@Component({
  selector: 'app-sarviews-results-menu',
  templateUrl: './sarviews-results-menu.component.html',
  styleUrls: [
    './sarviews-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
  imports: [MatCard, NgClass, TranslateModule, AsyncPipe],
})
export class SarviewsResultsMenuComponent {
  private screenSize = inject(ScreenSizeService);
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
}
