import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { tap, map, delay } from 'rxjs/operators';
import { Store, Action } from '@ngrx/store';
import { SubSink } from 'subsink';

import { AppState } from '@store';
import * as filtersStore from '@store/filters';

import { Props } from '@models';
import { PropertyService } from '@services';

enum PathFormInputType {
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
export class PathSelectorComponent implements OnInit, OnDestroy {
  @ViewChild('pathForm', { static: true }) public pathForm: NgForm;

  private inputErrors$ = new Subject<PathFormInputType>();
  private currentError: PathFormInputType | null = null;
  
  public inputTypes = PathFormInputType;
  public pathStart: number | null;
  public pathEnd: number | null;
  public frameStart: number | null;
  public frameEnd: number | null;
  public selectedDataset: string | null = '';
  
  private get pathStartControl() {
    return this.pathForm.form
      .controls['pathStart'];
  }

  private get pathEndControl() {
    return this.pathForm.form
      .controls['pathEnd'];
  }

  private get frameStartControl() {
    return this.pathForm.form
      .controls['frameStart'];
  }

  private get frameEndControl() {
    return this.pathForm.form
      .controls['frameEnd'];
  }

  public p = Props;
  public shouldOmitSearchPolygon$ = this.store$.select(filtersStore.getShouldOmitSearchPolygon);
  private subs = new SubSink();

  constructor(
    public prop: PropertyService,
    private store$: Store<AppState>
  ) { }

  ngOnInit() {
    this.handlePathFrameErrors();

    this.subs.add(
      this.store$.select(filtersStore.getSelectedDatasetId).subscribe(
        selected => this.selectedDataset = selected
      )
    );
    this.subs.add(
      this.store$.select(filtersStore.getPathRange).subscribe(
        range => {
          this.pathStart = range.start;
          this.pathEnd = range.end;
        }
      )
    );
    this.subs.add(
      this.store$.select(filtersStore.getFrameRange).subscribe(
        range => {
          this.frameStart = range.start;
          this.frameEnd = range.end;
        }
      )
    );
  }

  public numberOnly(event): boolean {
    const charCode = (event.which) ?
      event.which :
      event.keyCode;

    return (charCode > 31 && (charCode < 48 || charCode > 57));
  }

  public onValueChanged(event: Event, inputType: PathFormInputType): void {
    const inputValue = (event.target as HTMLInputElement).valueAsNumber;

    let val: number | null = null;

    if (this.isValidNumber(inputValue)) {
      val = inputValue;
    }

    const action = this.getActionFor(inputType, val);
    this.store$.dispatch(action);
  }

  private getActionFor(inputType: PathFormInputType, val: number | null): Action {
    const ActionType = {
      [PathFormInputType.PATH_START]: filtersStore.SetPathStart,
      [PathFormInputType.PATH_END]: filtersStore.SetPathEnd,
      [PathFormInputType.FRAME_START]: filtersStore.SetFrameStart,
      [PathFormInputType.FRAME_END]: filtersStore.SetFrameEnd,
    }[inputType];

    return new ActionType(val);
  }

  private isValidNumber(val: number): boolean {
    return !isNaN(val) && val >= 0;
  }

  public onNewOmitPolygon(e): void {
    const action = e.checked ?
      new filtersStore.OmitSearchPolygon() :
      new filtersStore.UseSearchPolygon();

    this.store$.dispatch(action);
  }

  public onClear(): void {
    this.store$.dispatch(new filtersStore.ClearPathRange());
    this.store$.dispatch(new filtersStore.ClearFrameRange());
  }

  public typeHasError(inputType: PathFormInputType): boolean {
    return this.currentError === inputType;
  }

  private handlePathFrameErrors(): void {
    this.subs.add(
      this.inputErrors$.pipe(
        tap(inputType => this.currentError = inputType),
        map(
          inputType => this.getInput(inputType)
        ),
        tap(control => {
          control.reset();
          control.setErrors({'incorrect': true});
        }),
        delay(820),
      ).subscribe(control => {
        this.currentError = null;
        control.setErrors(null);
      })
    );
  }

  private getInput(inputType: PathFormInputType) {
    return {
      [PathFormInputType.PATH_START]: this.pathStartControl,
      [PathFormInputType.PATH_END]: this.pathEndControl,
      [PathFormInputType.FRAME_START]: this.frameStartControl,
      [PathFormInputType.FRAME_END]: this.frameEndControl,
    }[inputType];
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
