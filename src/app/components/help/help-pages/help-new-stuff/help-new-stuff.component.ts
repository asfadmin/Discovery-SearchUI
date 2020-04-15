import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as models from '@models';
import * as services from '@services';


@Component({
  selector: 'app-help-new-stuff',
  templateUrl: './help-new-stuff.component.html',
  styleUrls: ['./help-new-stuff.component.scss']
})
export class HelpNewStuffComponent implements OnInit {

  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = models.Breakpoints;

  constructor(
    private screenSize: services.ScreenSizeService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
