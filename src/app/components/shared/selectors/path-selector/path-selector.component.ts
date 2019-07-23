import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { Range, Props } from '@models';
import { PropertyService } from '@services';

enum PathFormInputs {
  PATH_START = 'Path Start',
  PATH_END = 'Path End',
  FRAME_START = 'Frame Start',
  FRAME_END = 'Frame End'
}

@Component({
  selector: 'app-path-selector',
  templateUrl: './path-selector.component.html',
  styleUrls: ['./path-selector.component.scss']
})
export class PathSelectorComponent implements OnInit {
  @ViewChild('pathForm', { static: true }) public pathForm: NgForm;

  private inputErrors$ = new Subject<PathFormInputs>();

  public pathStart: number | null;
  public pathEnd: number | null;
  public frameStart: number | null;
  public frameEnd: number | null;

  private get pathStartControl() {
    return this.pathForm.form
      .controls['pathStart'];
  }

  private get pathEndControl() {
    return this.pathForm.form
      .controls['pathEnd'];
  }

  public p = Props;
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.store$.select(filtersStore.getPathRange).subscribe(
      range => {
        this.pathStart = range.start;
        this.pathEnd = range.end;
      }
    );
    this.store$.select(filtersStore.getFrameRange).subscribe(
      range => {
        this.frameStart = range.start;
        this.frameEnd = range.end;
      }
    );
  }

  public onPathStartChanged(path: string): void {
    if (!this.isValidNumber(path)) {
      console.log('error loading number');
    }

    this.store$.dispatch(new filtersStore.SetPathStart(+path));
  }

  public onPathEndChanged(path: string): void {
    if (!this.isValidNumber(path)) {
      console.log('error loading number');
    }

    this.store$.dispatch(new filtersStore.SetPathEnd(+path));
  }

  public onFrameStartChanged(frame: string): void {
    if (!this.isValidNumber(frame)) {
      console.log('error loading number');
    }

    this.store$.dispatch(new filtersStore.SetFrameStart(+frame));
  }

  public onFrameEndChanged(frame: string): void {
    if (!this.isValidNumber(frame)) {
      console.log('error loading number');
    }

    this.store$.dispatch(new filtersStore.SetFrameEnd(+frame));
  }

  private isValidNumber(val: string): boolean {
    return !val || isNaN(+val) || +val < 0;
  }

  public onNewOmitPolygon(e): void {
    const action = e.checked ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }
}
