import { Component, inject, input, output } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as models from '@models';
import { NotificationService } from '@services';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateService } from '@ngx-translate/core';

import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SceneGroupFileComponent } from '../scene-file/scene-group-file/scene-group-file.component';

@Component({
  selector: 'app-scene-group-files',
  templateUrl: './scene-group-files.component.html',
  styleUrls: ['./scene-group-files.component.scss'],
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner,
    MatIcon,
    MatIconButton,
    MatTooltip,
    AsyncPipe,
    TranslateModule,
    SceneGroupFileComponent,
  ],
})
export class SceneGroupFilesComponent {
  productsByGroup = input<Record<string, models.CMRProduct[]> | null>(null);
  groups = input<string[] | null>(null);
  queuedProductIds = input<Set<string> | null>(null);
  validJobTypesByProduct = input<Record<string, models.Hyp3JobType[]>>({});
  showRelatedData = input(false);
  subqueryProducts$ = input<Observable<models.CMRProduct[]>>();
  subqueryLoaded = input(false);

  toggleProduct = output<models.CMRProduct>();
  queueHyp3Job = output<models.QueuedHyp3Job>();

  private store$ = inject<Store<AppState>>(Store);
  private notificationService = inject(NotificationService);
  private translate = inject(TranslateService);

  public onQueueGroup(
    event: Event,
    products: models.CMRProduct[],
    labelKey: string,
  ): void {
    event.stopPropagation();
    this.store$.dispatch(new queueStore.AddItems(products));
    this.notificationService.info(
      this.translate.instant('FILES_ADDED_FROM_GROUP', {
        count: products.length,
        group: this.translate.instant(labelKey),
      }),
    );
  }
}
