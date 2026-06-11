import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';

import * as moment from 'moment';

import * as queueStore from '@store/queue';
import * as searchStore from '@store/search';

import {
  EnvironmentService,
  Hyp3JobStatusService,
  OnDemandService,
} from '@services';
import * as models from '@models';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '@store';
import { Store } from '@ngrx/store';
import { SearchType } from '@models';
import * as filterStore from '@store/filters';
import {
  MatListItem,
  MatListItemIcon,
  MatListItemTitle,
  MatListItemMeta,
  MatListItemLine,
} from '@angular/material/list';
import { AsyncPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { CopyToClipboardComponent } from '@components/shared/copy-to-clipboard/copy-to-clipboard.component';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import {
  ProjectNameDialogComponent,
  ProjectNameDialogData,
} from '@components/shared/project-name-dialog';
import { DownloadFileButtonComponent } from '@components/shared/download-file-button/download-file-button.component';
import { CartToggleComponent } from '@components/shared/cart-toggle/cart-toggle.component';
import { Hyp3JobStatusBadgeComponent } from '@components/shared/hyp3-job-status-badge/hyp3-job-status-badge.component';
import { TruncateModule } from '@yellowspot/ng-truncate';
import { ReadableSizeFromBytesPipe } from '@pipes/readable-size-from-bytes.pipe';
import { FullDatePipe } from '@pipes/short-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-scene-file',
  templateUrl: './scene-file.component.html',
  styleUrls: ['./scene-file.component.scss'],
  imports: [
    MatListItem,

    MatListItemIcon,
    MatIcon,
    MatTooltip,
    MatListItemTitle,
    CopyToClipboardComponent,
    MatIconButton,
    MatListItemMeta,
    MatMenuTrigger,
    MatMenu,
    MatProgressSpinner,

    MatMenuItem,
    MatListItemLine,
    DownloadFileButtonComponent,
    CartToggleComponent,
    Hyp3JobStatusBadgeComponent,
    AsyncPipe,
    TruncateModule,
    ReadableSizeFromBytesPipe,
    FullDatePipe,
    TranslateModule,
  ],
})
export class SceneFileComponent implements OnInit, OnDestroy {
  private hyp3JobStatus = inject(Hyp3JobStatusService);
  private store$ = inject<Store<AppState>>(Store);
  env = inject(EnvironmentService);
  private onDemand = inject(OnDemandService);
  private dialog = inject(MatDialog);

  @Input() product: models.CMRProduct;
  @Input() isQueued: boolean;
  @Input() isOpen: boolean;
  @Input() isUserLoggedIn: boolean;
  @Input() validHyp3JobTypes: models.Hyp3JobType[];
  @Input() hasAccessToRestrictedData: boolean;
  @Input() loadingHyp3JobName: string | null;
  @Input() isSearchableProduct = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() closeProduct = new EventEmitter<models.CMRProduct>();
  @Output() queueHyp3Job = new EventEmitter<models.QueuedHyp3Job>();
  @Output() renameJobProjectName = new EventEmitter<string>();

  public searchType$ = this.store$.select(searchStore.getSearchType);
  public searchTypes = SearchType;
  public isHovered = false;
  public paramsList = [];

  private subs = new SubSink();

  ngOnInit() {
    this.subs.add(
      of(this.product)
        .pipe(filter((prod) => !!prod.metadata))
        .subscribe((prod) => {
          if (!prod.metadata.job) {
            this.paramsList = [];
          } else {
            this.paramsList = this.onDemand.jobParamsToList(prod.metadata);
          }
        }),
    );
  }

  public onToggleQueueProduct(): void {
    this.toggle.emit();
  }

  public onCloseProduct(): void {
    this.closeProduct.emit(this.product);
  }

  public expirationBadge(expiration_time: moment.Moment): string {
    const days = this.expirationDays(expiration_time);

    const plural = days === 0 ? '' : 's';

    return days > 0 ? `(Expires: ${days} Day${plural})` : '';
  }

  public isDownloadable(product: models.CMRProduct): boolean {
    return this.hyp3JobStatus.isDownloadable(product.metadata.job);
  }

  public addJobToProcessingQueue(jobType: models.Hyp3JobType): void {
    this.queueHyp3Job.emit({
      granules: [this.product],
      job_type: jobType,
    });
  }

  public queueExpiredHyp3Job() {
    const job_types = models.hyp3JobTypes;
    const job_type = Object.keys(job_types).find((id) => {
      return this.product.metadata.job.job_type === (id as any);
    });

    this.store$.dispatch(
      new queueStore.AddJob({
        granules: this.product.metadata.job.scenes,
        job_type: job_types[job_type],
      }),
    );
  }

  public onEditProjectName(oldProjectName: string): void {
    const dialogRef = this.dialog.open<
      ProjectNameDialogComponent,
      ProjectNameDialogData,
      string
    >(ProjectNameDialogComponent, {
      width: '400px',
      data: {
        currentName: oldProjectName,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.renameJobProjectName.emit(result);
      }
    });
  }

  private expirationDays(expiration_time: moment.Moment): number {
    const current = moment.utc();

    const expiration = moment.duration(expiration_time.diff(current));

    return Math.floor(expiration.asDays());
  }

  public onOpenHelp(e: Event, infoUrl: string) {
    e.stopPropagation();
    window.open(infoUrl);
  }

  public isExpired(job: models.Hyp3Job): boolean {
    if (job) {
      return this.hyp3JobStatus.isExpired(job);
    }
    return false;
  }

  // Event handler required by template but no action needed
  public prodDownloaded(_product: models.CMRProduct): void {
    // Intentionally empty - event binding required but no action needed
  }

  public onSearchProduct() {
    if (
      ['RTC-STATIC', 'CSLC-STATIC'].includes(this.product.metadata.productType)
    ) {
      const processinglevel = this.product.metadata.productType;
      const productType = models.opera_s1.productTypes.find(
        (product) => product.apiValue == processinglevel,
      );
      const operaburstid = this.product.metadata?.opera?.operaBurstID;

      [
        new searchStore.SetSearchType(models.SearchType.DATASET),
        new filterStore.ClearDatasetFilters(),
        new filterStore.SetSelectedDataset(models.opera_s1.apiValue.dataset),
        new filterStore.SetProductTypes([productType]),
        new filterStore.setOperaBurstIDs([operaburstid]),
        new searchStore.MakeSearch(),
      ].forEach((action) => this.store$.dispatch(action));
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
