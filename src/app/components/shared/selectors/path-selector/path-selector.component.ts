import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { Range } from '@models';

@Component({
  selector: 'app-path-selector',
  templateUrl: './path-selector.component.html',
  styleUrls: ['./path-selector.component.scss']
})
export class PathSelectorComponent implements OnInit {
  public pathRange: Range<number | null>;
  public frameRange: Range<number | null>;

  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  constructor(private store$: Store<AppState>) { }

  ngOnInit() {
    this.store$.select(filtersStore.getPathRange).subscribe(
      range => this.pathRange = range
    );
    this.store$.select(filtersStore.getFrameRange).subscribe(
      range => this.frameRange = range
    );
  }

  public onPathStartChanged(path: string): void {
    this.store$.dispatch(new filtersStore.SetPathStart(+path));
  }

  public onPathEndChanged(path: string): void {
    this.store$.dispatch(new filtersStore.SetPathEnd(+path));
  }

  public onFrameStartChanged(frame: string): void {
    this.store$.dispatch(new filtersStore.SetFrameStart(+frame));
  }

  public onFrameEndChanged(frame: string): void {
    this.store$.dispatch(new filtersStore.SetFrameEnd(+frame));
  }

  public onNewOmitPolygon(e): void {
    const action = e.checked ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }
}
