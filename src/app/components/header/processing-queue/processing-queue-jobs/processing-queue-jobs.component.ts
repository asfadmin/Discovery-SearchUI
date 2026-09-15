import { NgPlural, NgPluralCase, UpperCasePipe } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  inject,
  Signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/input';
import {
  MatList,
  MatListItem,
  MatListItemAvatar,
  MatListItemTitle,
  MatListItemLine,
  MatListItemMeta,
} from '@angular/material/list';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { ProcessingQueueComponent } from '@components/header/processing-queue';
import * as models from '@models';
import { QueuedHyp3Job, SearchType } from '@models';
import { ReadableSizeFromBytesPipe } from '@pipes/readable-size-from-bytes.pipe';
import { ShortDatePipe } from '@pipes/short-date.pipe';
import * as services from '@services';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';
import * as searchStore from '@store/search';
import * as userStore from '@store/user';

@Component({
  selector: 'app-processing-queue-jobs',
  templateUrl: './processing-queue-jobs.component.html',
  styleUrls: ['./processing-queue-jobs.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    FormsModule,

    MatOption,

    NgPlural,
    NgPluralCase,
    MatList,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    MatIconButton,
    MatTooltip,
    MatIcon,
    MatButton,
    UpperCasePipe,
    ReadableSizeFromBytesPipe,
    ShortDatePipe,
    TranslateModule,
  ],
})
export class ProcessingQueueJobsComponent implements OnInit {
  private store$ = inject<Store<AppState>>(Store);
  private savedSearchService = inject(services.SavedSearchService);
  private dialogRef =
    inject<MatDialogRef<ProcessingQueueComponent>>(MatDialogRef);

  @Input() areJobsLoading: boolean;
  @Input() costPerJob: number;
  @Input() isHyp3PlusMode: boolean;

  @Input() set jobs(val: models.QueuedHyp3Job[]) {
    this.jobs$.next(val);
  }
  private jobs$ = new BehaviorSubject<models.QueuedHyp3Job[]>([]);
  private sortChange$ = new BehaviorSubject<void>(null);

  // change detection keeps updating the view when it shouldn't causing flickering.
  // this observable ensures we only update the dispalyed processing queue list when the values actually change
  // or when the user changes the sorting order.
  jobsfiltered$ = combineLatest([
    this.jobs$.pipe(distinctUntilChanged()),
    this.sortChange$,
  ]).pipe(
    map(([jobs, _]) => jobs),
    filter((jobs) => !!jobs),
    map((jobs) => this.sortJobQueue(jobs)),
  );

  @Output() removeJob = new EventEmitter<models.QueuedHyp3Job>();

  public projectName = '';
  public isLoggedIn: Signal<boolean> = this.store$.selectSignal(
    userStore.getIsUserLoggedIn,
  );

  public sortTypes = Object.keys(ProcessingQueueJobsSortType).map(
    (key) => ProcessingQueueJobsSortType[key],
  );
  public sortOrders = Object.keys(ProcessingQueueJobsSortOrder).map(
    (key) => ProcessingQueueJobsSortOrder[key],
  );
  public sortOrder: ProcessingQueueJobsSortOrder =
    ProcessingQueueJobsSortOrder.LATEST;
  public sortType: ProcessingQueueJobsSortType =
    ProcessingQueueJobsSortType.ACQUISITION;

  public jobsDisplay: QueuedHyp3Job[] = [];

  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.jobsfiltered$.subscribe((jobs) => (this.jobsDisplay = jobs)),
    );
  }

  public onSortChange() {
    this.sortChange$.next(null);
  }

  public onProjectNameChange(projectName: string): void {
    this.store$.dispatch(new hyp3Store.SetProcessingProjectName(projectName));
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.removeJob.emit(job);
  }

  public viewCustomProducts(event: MouseEvent): void {
    this.store$.dispatch(
      new searchStore.SetSearchType(SearchType.CUSTOM_PRODUCTS),
    );
    this.store$.dispatch(new searchStore.ClearSearch());

    this.store$.dispatch(new searchStore.MakeSearch());

    const search = this.savedSearchService.makeCurrentSearch(`${Date.now()}`);

    if (search) {
      this.store$.dispatch(new userStore.AddSearchToHistory(search));
      this.store$.dispatch(new userStore.SaveSearchHistory());
    }

    this.dialogRef.close();

    event.preventDefault();
  }

  public sortJobQueue(jobs: models.QueuedHyp3Job[]): models.QueuedHyp3Job[] {
    let output = [].concat(jobs);
    if (this.sortType === ProcessingQueueJobsSortType.ACQUISITION) {
      output = output.sort((a, b) => {
        if (
          moment(a.granules[0].metadata.date) <
          moment(b.granules[0].metadata.date)
        ) {
          return -1;
        } else if (
          moment(a.granules[0].metadata.date) >
          moment(b.granules[0].metadata.date)
        ) {
          return 1;
        }
        return 0;
      });
    }

    if (this.sortOrder === ProcessingQueueJobsSortOrder.LATEST) {
      output = output.reverse();
    }

    return output;
  }
}

export enum ProcessingQueueJobsSortOrder {
  OLDEST = 'Oldest',
  LATEST = 'Latest',
}
export enum ProcessingQueueJobsSortType {
  ACQUISITION = 'START_DATE',
  DATE_ADDED = 'DATE_ADDED',
}
