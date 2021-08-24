import { Component, Input, OnInit } from '@angular/core';
import { SarviewsEvent } from '@models';

import * as models from '@models';

@Component({
  selector: 'app-sarview-event',
  templateUrl: './sarview-event.component.html',
  styleUrls: ['./sarview-event.component.scss']
})
export class SarviewEventComponent implements OnInit {
  @Input() event: SarviewsEvent

  public hovered = false;
  public isSelected = false;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;

  constructor() { }

  ngOnInit(): void {
    console.log(this.event);
  }

  public onSetFocused() {
    this.hovered = true;
  }

  public onClearFocused() {
    this.hovered = false;
  }

  public onSetSelected() {
    this.isSelected = true;
  }

}
