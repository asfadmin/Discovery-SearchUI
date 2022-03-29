import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import * as moment from 'moment';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as filtersStore from '@store/filters';
import * as uiStore from '@store/ui';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';

import { CreateSubscriptionComponent } from '@components/header/create-subscription';
import { ScreenSizeService, Hyp3Service, WktService, MapService } from '@services';
import * as models from '@models';

@Component({
  selector: 'app-on-demand-subscriptions',
  templateUrl: './on-demand-subscriptions.component.html',
  styleUrls: [
    './on-demand-subscriptions.component.scss',
    '../save-user-filters/save-user-filters.component.scss',
    '../saved-searches/saved-searches.component.scss',
  ]
})
export class OnDemandSubscriptionsComponent implements OnInit, OnDestroy {
  public subscriptions = [];
  public selectedSubId: string = null;

  public breakpoint: models.Breakpoints;
  public breakpoints = models.Breakpoints;
  public loadingSubs = new Set();

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchType: models.SearchType;
  public SearchType = models.SearchType;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private dialog: MatDialog,
    private screenSize: ScreenSizeService,
    private wktService: WktService,
    private mapService: MapService,
    private hyp3: Hyp3Service,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(hyp3Store.getOnDemandSubscriptions).subscribe(
        subs => this.subscriptions = subs
      )
    );

    this.subs.add(
      this.searchType$.subscribe(searchType => {
        this.searchType = searchType;
      })
    );
  }

  public onCreateSubscription() {
    const ref = this.dialog.open(CreateSubscriptionComponent, {
      id: 'subscriptionQueueDialog',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });

    ref.afterClosed().subscribe(
      _ => {
        this.store$.dispatch(new hyp3Store.LoadSubscriptions());
      }
    );
  }

  public onRenewSubscription(sub: models.OnDemandSubscription): void {
    let end;

    if (this.expiresThisMonth(sub)) {
      const subEnd = new Date(sub.filters.end);
      const newEnd = new Date(subEnd.setDate(subEnd.getDate() + 30));
      end = moment.utc(newEnd).format();
    } else {
      const today = new Date();
      const endDate = new Date(today.setDate(today.getDate() + 30));
      end = moment.utc(endDate).format();
    }

    this.hyp3.editSubscription(sub.id, {end}).subscribe(
      _ => {
        this.store$.dispatch(new hyp3Store.LoadSubscriptions());
      }
    );
  }

  private expiresThisMonth(sub: models.OnDemandSubscription): boolean {
    const today = new Date();
    const subEnd = new Date(sub.filters.end);
    const daysLeft = Math.max(moment(subEnd).diff(moment(today), 'days'), 0);

    return daysLeft < 29;
  }

  public onLoadSearch(sub: models.OnDemandSubscription): void {
    this.store$.dispatch(new searchStore.SetSearchType(models.SearchType.DATASET));
    this.store$.dispatch(new searchStore.ClearSearch());

    const filters = sub.filters;
    const features = this.wktService.wktToFeature(
      filters.intersectsWith,
      this.mapService.epsg()
    );

    this.mapService.setDrawFeature(features);

    if (filters.processingLevel !== undefined) {
      models.sentinel_1.productTypes.forEach(productType => {
        if (productType.apiValue === filters.processingLevel) {
          this.store$.dispatch(new filtersStore.SetProductTypes([productType]));
        }
      });
    }

    if (filters.flightDirection !== undefined) {
      this.store$.dispatch(new filtersStore.SetFlightDirections([filters.flightDirection]));
    }

    if (filters.polarization !== undefined) {
      this.store$.dispatch(new filtersStore.SetPolarizations(filters.polarization));
    }

    if (filters.beamMode !== undefined) {
      this.store$.dispatch(new filtersStore.SetBeamModes(filters.beamMode));
    }

    if (filters.relativeOrbit !== undefined) {
      this.store$.dispatch(new filtersStore.SetPathStart(filters.relativeOrbit));
      this.store$.dispatch(new filtersStore.SetPathEnd(filters.relativeOrbit));
    }

    if (filters.frame !== undefined) {
      this.store$.dispatch(new filtersStore.SetFrameStart(filters.frame));
      this.store$.dispatch(new filtersStore.SetFrameEnd(filters.frame));
    }

    this.store$.dispatch(new uiStore.CloseSidebar());
    this.store$.dispatch(new searchStore.MakeSearch());
  }

  public onClose() {
    this.store$.dispatch(new uiStore.CloseSidebar());
  }

  public onNewEndDate(subId, date: Date): void {
    const end = moment.utc(date).format();

    this.hyp3.editSubscription(subId, {end}).subscribe(
      _ => {
        this.store$.dispatch(new hyp3Store.LoadSubscriptions());
      }
    );
  }

  public onToggleSelected(subId: string): void {
    if (this.selectedSubId === subId) {
      this.selectedSubId = null;
    } else {
      this.selectedSubId = subId;
    }
  }

  public onToggleEnabled(sub: models.OnDemandSubscription): void {
    this.loadingSubs.add(sub.id);

    this.hyp3.editSubscription(sub.id, {enabled: !sub.enabled}).subscribe(
      _ => {
        this.store$.dispatch(new hyp3Store.LoadSubscriptions());
        this.loadingSubs.delete(sub.id);
      }
    );
  }

  public onLoadProductsFor(subName: string): void {
    this.store$.dispatch(new uiStore.CloseSidebar());
    this.store$.dispatch(new searchStore.SetSearchType(models.SearchType.CUSTOM_PRODUCTS));
    this.store$.dispatch(new filtersStore.SetProjectName(subName));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

