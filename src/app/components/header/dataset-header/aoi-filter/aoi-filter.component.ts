import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as mapStore from '@store/map';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { menuAnimation, MapInteractionModeType } from '@models';
import * as services from '@services';
import { DrawNewPolygon } from '@store/map';
import { SetGeocode } from '@store/filters';

@Component({
  selector: 'app-aoi-filter',
  templateUrl: './aoi-filter.component.html',
  styleUrls: ['./aoi-filter.component.scss', '../../header.component.scss'],
  animations: menuAnimation,
})
export class AoiFilterComponent implements OnInit, OnDestroy {
  @ViewChild('polygonForm') public polygonForm: NgForm;

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
        p => {
          this.polygon = p;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'input-search-polygon',
            'input-search-polygon': this.polygon
          });

        }
      )
    );

    this.handleAOIErrors();
  }

  public openAOIImport() {
    const action = new mapStore.SetMapInteractionMode(MapInteractionModeType.UPLOAD);
    this.store$.dispatch(action);
  }

  public toggleAOIOptions(): void {
    this.store$.dispatch(new uiStore.ToggleAOIOptions());
    this.store$.dispatch(new uiStore.CloseFiltersMenu());
  }

  public closeAOIOptions(): void {
    this.store$.dispatch(new uiStore.CloseAOIOptions());
  }

  public onInputSearchPolygon(event: Event): void {
    const polygon = (event.target as HTMLInputElement).value;
    const didLoad = this.mapService.loadPolygonFrom(polygon);

    if (!didLoad) {
      this.aoiErrors$.next();
    } else {
      this.store$.dispatch(new SetGeocode(''));
      this.store$.dispatch(new DrawNewPolygon());
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
