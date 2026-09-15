import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  inject,
  Signal,
} from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
} from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { Subject } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { AoiOptionsComponent } from '@components/shared/aoi-options/aoi-options.component';
import { menuAnimation, MapInteractionModeType, SearchType } from '@models';
import * as services from '@services';
import { AppState } from '@store';
import { SetGeocode } from '@store/filters';
import * as mapStore from '@store/map';
import { DrawNewPolygon } from '@store/map';
import * as searchStore from '@store/search';
import * as uiStore from '@store/ui';

@Component({
  selector: 'app-aoi-filter',
  templateUrl: './aoi-filter.component.html',
  styleUrls: ['./aoi-filter.component.scss', '../../header.component.scss'],
  animations: menuAnimation,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,

    MatIcon,
    MatSuffix,
    MatTooltip,
    MatCard,
    AoiOptionsComponent,
    TranslateModule,
  ],
})
export class AoiFilterComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);
  private mapService = inject(services.MapService);
  private clipboard = inject(ClipboardService);
  private notificationService = inject(services.NotificationService);
  private language = inject(services.AsfLanguageService);

  @ViewChild('polygonForm') public polygonForm: NgForm;

  public aoiErrors$ = new Subject<void>();

  public isAOIError = false;
  public isHoveringAOISelector = false;
  public isAOIOptionsOpen: Signal<boolean> = this.store$.selectSignal(
    uiStore.getIsAOIOptionsOpen,
  );

  public searchtype: Signal<SearchType> = this.store$.selectSignal(
    searchStore.getSearchType,
  );

  public polygon: string;
  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      this.mapService.searchPolygon$.subscribe((p) => {
        this.polygon = p;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'input-search-polygon',
          'input-search-polygon': this.polygon,
        });
      }),
    );

    this.handleAOIErrors();
  }

  public openAOIImport() {
    const action = new mapStore.SetMapInteractionMode(
      MapInteractionModeType.UPLOAD,
    );
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

    if (
      !didLoad ||
      (this.searchtype() === SearchType.DISPLACEMENT &&
        !polygon.toLowerCase().includes('point'))
    ) {
      this.aoiErrors$.next();
    } else {
      this.store$.dispatch(new SetGeocode(''));
      this.store$.dispatch(new DrawNewPolygon());
    }
  }

  public onCopy(): void {
    this.clipboard.copyFromContent(this.polygon);
    this.notificationService.info(
      this.language.translate.instant('COPIED_TO_CLIPBOARD'),
    );
  }

  private handleAOIErrors(): void {
    this.subs.add(
      this.aoiErrors$
        .pipe(
          tap((_) => {
            this.isAOIError = true;
            this.mapService.clearDrawLayer();
            this.polygonForm.reset();
            this.polygonForm.form.controls['searchPolygon'].setErrors({
              incorrect: true,
            });
          }),
          delay(820),
        )
        .subscribe((_) => {
          this.isAOIError = false;
          this.polygonForm.form.controls['searchPolygon'].setErrors(null);
        }),
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
