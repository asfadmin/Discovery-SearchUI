import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import {
  MatButtonToggleGroup,
  MatButtonToggle,
} from '@angular/material/button-toggle';
import { MatCard, MatCardSubtitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ResizeEvent, ResizableModule } from 'angular-resizable-element';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { DocsModalComponent } from '@components/shared/docs-modal/docs-modal.component';
import { SceneMetadataComponent } from '@components/shared/scene-metadata/scene-metadata.component';
import { Breakpoints, CMRProductPair } from '@models';
import { ScreenSizeService, DatasetForProductService } from '@services';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

import { ScenesListComponent } from '../scenes-list/scenes-list.component';
import { ScenesListHeaderComponent } from '../scenes-list-header/scenes-list-header.component';
import { SbasSlidersComponent } from './sbas-sliders/sbas-sliders.component';
import { SbasSlidersTwoComponent } from './sbas-sliders-two/sbas-sliders-two.component';
import { SBASChartComponent } from '../../sbas-chart/sbas-chart.component';

enum CardViews {
  LIST = 0,
  DETAIL = 1,
}

@Component({
  selector: 'app-sbas-results-menu',
  templateUrl: './sbas-results-menu.component.html',
  styleUrls: [
    './sbas-results-menu.component.scss',
    '../results-menu.component.scss',
  ],
  imports: [
    MatCard,
    MatCardSubtitle,
    ScenesListHeaderComponent,
    ScenesListComponent,

    SceneMetadataComponent,
    MatTooltip,
    ResizableModule,
    MatIcon,
    MatButtonToggleGroup,
    MatButtonToggle,
    SbasSlidersComponent,
    DocsModalComponent,
    SBASChartComponent,
    SbasSlidersTwoComponent,
    TranslateModule,
  ],
})
export class SBASResultsMenuComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private screenSize = inject(ScreenSizeService);
  datasetForProduct = inject(DatasetForProductService);

  @ViewChild('listCard', { read: ElementRef }) listCardView: ElementRef;
  @ViewChild('chartCard', { read: ElementRef }) chartCardView: ElementRef;

  @Input() resize$: Observable<void>;
  public searchType = this.store$.selectSignal(searchStore.getSearchType);

  public pair: CMRProductPair;
  public isAddingCustomPoint = this.store$.selectSignal(
    uiStore.getIsAddingCustomPoint,
  );

  public view = CardViews.LIST;
  public Views = CardViews;

  public listCardMaxWidth = '38%';
  public chartCardMaxWidth = '55%';
  private minChartWidth = 25.0;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  public isSelectedPairCustom = this.store$.selectSignal(
    scenesStore.getIsSelectedPairCustom,
  );
  private subs = new SubSink();

  public zoomInChart$ = new Subject<void>();
  public zoomOutChart$ = new Subject<void>();
  public zoomToFitChart$ = new Subject<void>();

  public isDisconnected = false;

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        (point) => (this.breakpoint = point),
      ),
    );

    this.subs.add(
      this.store$
        .select(scenesStore.getSelectedPair)
        .pipe(map((pair) => (!pair?.[0] ? null : pair)))
        .subscribe((selected: CMRProductPair) => {
          selected?.sort((a, b) => {
            if (a.metadata.date < b.metadata.date) {
              return -1;
            }
            return 1;
          });

          this.pair = selected?.map((product) => ({
            ...product,
            metadata: {
              ...product.metadata,
              temporal:
                product.metadata.temporal - selected[0].metadata.temporal,
              perpendicular:
                product.metadata.perpendicular -
                selected[0].metadata.perpendicular,
            },
          }));
        }),
    );
  }

  public onResizeEnd(event: ResizeEvent): void {
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    const newChartWidth =
      event.rectangle.width > windowWidth ? windowWidth : event.rectangle.width;
    const newChartMaxWidth = Math.max(
      this.minChartWidth,
      Math.round((newChartWidth / windowWidth) * 100),
    );
    const newListMaxWidth = 100 - newChartMaxWidth;

    this.listCardMaxWidth = newListMaxWidth.toString() + '%';
    this.chartCardMaxWidth = newChartMaxWidth.toString() + '%';
  }

  public startAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StartAddingCustomPoint());
  }

  public stopAddingCustomPoint(): void {
    this.store$.dispatch(new uiStore.StopAddingCustomPoint());
  }

  public deleteSelectedPair(): void {
    this.store$.dispatch(new scenesStore.RemoveCustomPair(this.pair));
  }

  public onToggleFiltersMenu(): void {
    this.store$.dispatch(new uiStore.OpenFiltersMenu());
  }

  public onSelectList(): void {
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  public zoomIn(): void {
    this.zoomInChart$.next();
  }

  public zoomOut(): void {
    this.zoomOutChart$.next();
  }

  public zoomToFit(): void {
    this.zoomToFitChart$.next();
  }

  public onOpenHelp(url: string): void {
    window.open(url);
  }

  public isGraphDisconnected(isDisconnected) {
    this.isDisconnected = isDisconnected;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
