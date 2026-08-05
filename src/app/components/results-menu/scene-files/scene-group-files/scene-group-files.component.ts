import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as queueStore from '@store/queue';
import * as models from '@models';
import { NotificationService } from '@services';

import {
  MatTree,
  MatNestedTreeNode,
  MatTreeNodeDef,
} from '@angular/material/tree';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SceneGroupFileComponent } from '../scene-file/scene-group-file/scene-group-file.component';

interface FileGroup {
  labelKey: string;
  products: models.CMRProduct[];
  isRelatedData: boolean;
}

@Component({
  selector: 'app-scene-group-files',
  templateUrl: './scene-group-files.component.html',
  styleUrls: ['./scene-group-files.component.scss'],
  imports: [
    MatTree,
    MatNestedTreeNode,
    MatTreeNodeDef,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatProgressSpinner,
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

  private relatedProducts = toSignal(
    combineLatest([
      toObservable(this.showRelatedData),
      toObservable(this.subqueryProducts$),
    ]).pipe(
      switchMap(
        ([show, products$]): Observable<models.CMRProduct[] | null> =>
          show && products$ ? products$ : of(null),
      ),
    ),
    { initialValue: null },
  );

  readonly fileGroups = computed<FileGroup[]>(() => {
    const byGroup = this.productsByGroup();
    const fileGroups: FileGroup[] = [];

    if (byGroup && byGroup['default'].length > 0) {
      fileGroups.push({
        labelKey: 'SCIENCE_DATA',
        products: byGroup['default'],
        isRelatedData: false,
      });
    }

    for (const group of this.groups() ?? []) {
      if (group !== 'default' && byGroup[group].length > 0) {
        fileGroups.push({
          labelKey: 'FILE_GROUP_' + group.toUpperCase(),
          products: byGroup[group],
          isRelatedData: false,
        });
      }
    }

    if (this.showRelatedData()) {
      fileGroups.push({
        labelKey: 'RELATED_DATA',
        products: this.relatedProducts() ?? [],
        isRelatedData: true,
      });
    }

    return fileGroups;
  });

  readonly childrenOf = () => [];
  public trackGroup = (_: number, group: FileGroup) => group.labelKey;

  private toggled = signal<Set<string>>(new Set());

  public isExpanded(group: FileGroup): boolean {
    const expandedByDefault =
      group.labelKey === 'SCIENCE_DATA' || group.labelKey === 'RELATED_DATA';
    return this.toggled().has(group.labelKey)
      ? !expandedByDefault
      : expandedByDefault;
  }

  public onToggleGroup(group: FileGroup): void {
    const next = new Set(this.toggled());
    if (next.has(group.labelKey)) {
      next.delete(group.labelKey);
    } else {
      next.add(group.labelKey);
    }
    this.toggled.set(next);
  }

  public onQueueGroup(event: Event, group: FileGroup): void {
    event.stopPropagation();
    this.store$.dispatch(new queueStore.AddItems(group.products));
    this.notificationService.info(
      this.translate.instant('FILES_ADDED_FROM_GROUP', {
        count: group.products.length,
        group: this.translate.instant(group.labelKey),
      }),
    );
  }
}
