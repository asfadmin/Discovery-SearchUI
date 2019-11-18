import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ClipboardService } from 'ngx-clipboard';
import { SubSink } from 'subsink';

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
export class AoiFilterComponent implements OnInit, OnDestroy {
  @ViewChild('polygonForm', { static: false }) public polygonForm: NgForm;

  public aoiErrors$ = new Subject<void>();

  public isAOIError = false;
  public isHoveringAOISelector = false;
  public isAOIOptionsOpen: boolean;

  public polygon: string;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: services.MapService,
    private clipboard: ClipboardService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.store$.select(uiStore.getIsAOIOptionsOpen).subscribe(
        isAOIOptionsOpen => this.isAOIOptionsOpen = isAOIOptionsOpen
      )
    );

    this.subs.add(
      this.mapService.searchPolygon$.subscribe(
        p => this.polygon = p
      )
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
    const didLoad = this.mapService.loadPolygonFrom(polygon);

    if (!didLoad) {
      this.aoiErrors$.next();
    }
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
  }

  private handleAOIErrors(): void {
    this.subs.add(
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
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
