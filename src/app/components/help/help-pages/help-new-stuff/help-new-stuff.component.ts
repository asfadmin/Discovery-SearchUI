import { Component } from '@angular/core';

import * as models from '@models';
import * as services from '@services';


@Component({
  selector: 'app-help-new-stuff',
  templateUrl: './help-new-stuff.component.html',
  styleUrls: ['./help-new-stuff.component.scss']
})
export class HelpNewStuffComponent {

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private screenSize: services.ScreenSizeService,
  ) { }
}
