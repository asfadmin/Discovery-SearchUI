import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ViewType } from '@models';

@Component({
  selector: 'app-ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.css']
})
export class RibbonComponent {
  @Input() appView: ViewType;

  @Output() newAppView = new EventEmitter<ViewType>();

  public viewType = ViewType;

  public onMainViewSelected = () => this.newAppView.emit(ViewType.MAIN);
  public onSpreadsheetViewSelected = () => this.newAppView.emit(ViewType.SPREADSHEET);
  public onMapOnlyViewSelected = () => this.newAppView.emit(ViewType.MAP_ONLY);
}
