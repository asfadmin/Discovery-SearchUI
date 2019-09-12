import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  trigger, state, style, animate, transition
} from '@angular/animations';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Store, ActionsSubject } from '@ngrx/store';
import { ofType } from '@ngrx/effects';
import { ClipboardService } from 'ngx-clipboard';

import { AppState } from '@store';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';
import * as queueStore from '@store/queue';

import * as services from '@services';
import * as models from '@models';

@Component({
  selector: 'app-dataset-nav',
  templateUrl: './dataset-nav.component.html',
  styleUrls: ['./dataset-nav.component.css', '../nav-bar.component.scss'],

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
export class DatasetNavComponent implements OnInit {
  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  @Output() public openQueue = new EventEmitter<void>();

  public aoiErrors$ = new Subject<void>();

  public isAOIError = false;
  public isHoveringAOISelector = false;
  public isAOIOptionsOpen = false;

  public polygon: string;

  public queuedProducts$ = this.store$.select(queueStore.getQueuedProducts);

  constructor(
    private store$: Store<AppState>,
    private actions$: ActionsSubject,
    private legacyAreaFormat: services.LegacyAreaFormatService,
    private mapService: services.MapService,
    private wktService: services.WktService,
    private clipboard: ClipboardService,
  ) { }

  ngOnInit() {
    this.actions$.pipe(
      ofType<searchStore.MakeSearch>(searchStore.SearchActionType.MAKE_SEARCH),
    ).subscribe(
      _ => this.closeMenus()
    );

    this.store$.select(uiStore.getSearchType).subscribe(
      () => this.closeMenus()
    );

    this.mapService.searchPolygon$.subscribe(
      p => this.polygon = p
    );

    this.handleAOIErrors();
  }

  public closeMenus(): void {
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
    this.closeAOIOptions();
  }

  public toggleAOIOptions(): void {
    this.isAOIOptionsOpen = !this.isAOIOptionsOpen;

    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.ToggleFiltersMenu());
    this.closeAOIOptions();
  }

  public closeAOIOptions(): void {
    this.isAOIOptionsOpen = false;
  }

  public onInputSearchPolygon(polygon: string): void {
    if (this.legacyAreaFormat.isValid(polygon)) {
      polygon = this.legacyAreaFormat.toWkt(polygon);
    }

    this.loadWKT(polygon);
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }

  public onOpenDownloadQueue(): void {
    this.openQueue.emit();
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
