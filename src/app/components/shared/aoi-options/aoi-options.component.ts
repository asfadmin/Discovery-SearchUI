import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import { MapDrawModeType, MapInteractionModeType } from '@models';
import { MapService, WktService } from '@services';

@Component({
  selector: 'app-aoi-options',
  templateUrl: './aoi-options.component.html',
  styleUrls: ['./aoi-options.component.css'],
})
export class AoiOptionsComponent implements OnInit {
  @ViewChild('polygonInputForm', { static: false }) public polygonForm: NgForm;

  @Output() close = new EventEmitter<void>();

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);

  public polygon: string;
  public interactionTypes = MapInteractionModeType;

  public aoiErrors$ = new Subject<void>();
  public isAOIError = false;

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
  ) {}

  ngOnInit() {
    this.mapService.searchPolygon$.subscribe(
      polygon => this.polygon = polygon
    );
  }

  public onInputSearchPolygon(polygon: string): void {
    const didLoad = this.mapService.loadPolygonFrom(polygon);

    if (!didLoad) {
      this.aoiErrors$.next();
    }
  }

  public onFileUpload(): void {
    const action = new mapStore.SetMapInteractionMode(MapInteractionModeType.UPLOAD);
    this.store$.dispatch(action);
  }

  public onClearPolygon(): void {
    this.onNewInteractionMode(MapInteractionModeType.DRAW);
    this.mapService.clearDrawLayer();
  }

  public onNewInteractionMode(mode: MapInteractionModeType): void {
    this.store$.dispatch(new mapStore.SetMapInteractionMode(mode));
  }

  public onClose(): void {
    this.close.emit();
  }

  private handleAOIErrors(): void {
    this.aoiErrors$.pipe(
      tap(_ => {
        this.isAOIError = true;
        this.mapService.clearDrawLayer();
        this.polygonForm.reset();
        this.polygonForm.form
          .controls['searchPolygonLarge']
          .setErrors({'incorrect': true});
      }),
      delay(820),
    ).subscribe(_ => {
      this.isAOIError = false;
      this.polygonForm.form
        .controls['searchPolygonLarge']
        .setErrors(null);
    });
  }
}
