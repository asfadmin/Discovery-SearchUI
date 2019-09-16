import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';
import { ClipboardService } from 'ngx-clipboard';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import * as services from '@services';

@Component({
  selector: 'app-aoi-filter',
  templateUrl: './aoi-filter.component.html',
  styleUrls: ['./aoi-filter.component.css', '../../nav-bar.component.scss'],
  animations: [
    trigger('fadeTransition', [
      transition(':enter', [
        style({opacity: 0}),
        animate('100ms ease-in', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('100ms ease-out', style({opacity: 0}))
      ])
    ])
  ],
})
export class AoiFilterComponent implements OnInit {
  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  public aoiErrors$ = new Subject<void>();

  public isAOIError = false;
  public isHoveringAOISelector = false;
  public isAOIOptionsOpen: boolean;

  public polygon: string;

  constructor(
    private store$: Store<AppState>,
    private legacyAreaFormat: services.LegacyAreaFormatService,
    private mapService: services.MapService,
    private wktService: services.WktService,
    private clipboard: ClipboardService,
  ) { }

  ngOnInit() {
    this.store$.select(uiStore.getIsAOIOptionsOpen).subscribe(
      isAOIOptionsOpen => this.isAOIOptionsOpen = isAOIOptionsOpen
    );

    this.mapService.searchPolygon$.subscribe(
      p => this.polygon = p
    );

    this.handleAOIErrors();
  }

  public toggleAOIOptions(): void {
    this.store$.dispatch(new uiStore.ToggleAOIOptions());
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onInputSearchPolygon(polygon: string): void {
    if (this.legacyAreaFormat.isValid(polygon)) {
      polygon = this.legacyAreaFormat.toWkt(polygon);
    }

    this.loadWKT(polygon);
  }

  private loadWKT(polygon: string): void {
    try {
      const features = this.wktService.wktToFeature(
        polygon,
        this.mapService.epsg()
      );

      this.mapService.setDrawFeature(features);
    } catch (e) {
      this.aoiErrors$.next();
    }
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }

  private handleAOIErrors(): void {
    this.aoiErrors$.pipe(
      tap(_ => {
        this.isAOIError = true;
        this.mapService.clearDrawLayer();
        this.polygonForm.reset();
        this.polygonForm.form
          .controls['searchPolygon']
          .setErrors({'incorrect': true});
      }),
      delay(820),
    ).subscribe(_ => {
      this.isAOIError = false;
      this.polygonForm.form
        .controls['searchPolygon']
        .setErrors(null);
    });
  }
}
