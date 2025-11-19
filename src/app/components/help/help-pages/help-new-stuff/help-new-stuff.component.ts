import { Component, inject } from '@angular/core';

import * as models from '@models';
import * as services from '@services';
import { NgIf, NgClass, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-help-new-stuff',
  templateUrl: './help-new-stuff.component.html',
  styleUrls: ['./help-new-stuff.component.scss'],
  imports: [NgIf, NgClass, AsyncPipe],
})
export class HelpNewStuffComponent {
  private screenSize = inject(services.ScreenSizeService);

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;
}
