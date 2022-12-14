import { Component, OnInit, Output, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { Store } from '@ngrx/store';

import { AppState } from '@store';
import * as mapStore from '@store/map';
import { MapInteractionModeType, Breakpoints, SearchType } from '@models';
import { MapService, ScreenSizeService } from '@services';
import { SubSink } from 'subsink';
import { getSearchType, SetSearchOutOfDate } from '@store/search';
import { getIsFiltersMenuOpen, getIsResultsMenuOpen } from '@store/ui';

// Declare GTM dataLayer array.
declare global {
  interface Window { dataLayer: any[]; }
}

@Component({
  selector: 'app-aoi-options',
  templateUrl: './aoi-options.component.html',
  styleUrls: ['./aoi-options.component.scss'],
})
export class AoiOptionsComponent implements OnInit, OnDestroy {
  @ViewChild('polygonInputForm') public polygonForm: NgForm;

  @Input() showHeader = true;
  @Output() close = new EventEmitter<void>();

  public drawMode$ = this.store$.select(mapStore.getMapDrawMode);
  public interactionMode$ = this.store$.select(mapStore.getMapInteractionMode);

  public searchType$ = this.store$.select(getSearchType);
  public searchtype: SearchType;
  public isResultsMenuOpen: boolean;
  public isFiltersMenuOpen: boolean;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;

  public polygon: string;
  public interactionTypes = MapInteractionModeType;

  public aoiErrors$ = new Subject<void>();
  public isAOIError = false;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private mapService: MapService,
    private screenSize: ScreenSizeService,
  ) {}

  ngOnInit() {

    this.subs.add(
      this.mapService.searchPolygon$.subscribe(
        polygon => {
          this.polygon = polygon;
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            'event': 'input-search-polygon',
            'input-search-polygon': this.polygon
          });

        }
      )
    );

    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.searchType$.subscribe( searchtype => this.searchtype = searchtype)
    );

    this.subs.add(
      this.store$.select(getIsFiltersMenuOpen).subscribe(isOpen => this.isFiltersMenuOpen = isOpen)
    );

    this.subs.add(
      this.store$.select(getIsResultsMenuOpen).subscribe(isOpen => this.isResultsMenuOpen = isOpen)
    );

    this.handleAOIErrors();
  }

  public onFileHovered(e): void {
    e.preventDefault();
  }

  public onInputSearchPolygon(event: Event): void {
    const polygon = (event.target as HTMLInputElement).value;
    const didLoad = this.mapService.loadPolygonFrom(polygon);

    if (!didLoad) {
      this.aoiErrors$.next();
    } else {
      if (this.searchtype === SearchType.DATASET && this.isResultsMenuOpen && !this.isFiltersMenuOpen) {
        this.store$.dispatch(new SetSearchOutOfDate(true));
      }
    }
  }
  public onInputGeocodePolygon(wkt: string): void {
    const didLoad = this.mapService.loadPolygonFrom(wkt);

    if (!didLoad) {
      this.aoiErrors$.next();
    } else {
      if (this.searchtype === SearchType.DATASET && this.isResultsMenuOpen && !this.isFiltersMenuOpen) {
        this.store$.dispatch(new SetSearchOutOfDate(true));
      }
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

  public onOpenHelp(): void {
    window.open('https://docs.asf.alaska.edu/vertex/manual/#area-of-interest-options');
  }

  private handleAOIErrors(): void {
    this.subs.add(
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
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
