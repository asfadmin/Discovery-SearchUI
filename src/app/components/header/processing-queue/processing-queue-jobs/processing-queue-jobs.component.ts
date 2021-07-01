import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

import * as models from '@models';
import * as hyp3Store from '@store/hyp3';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import { SearchType } from '@models';
import * as services from '@services';
import * as userStore from '@store/user';
import { MatDialogRef } from '@angular/material/dialog';
import { ProcessingQueueComponent } from '@components/header/processing-queue';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-processing-queue-jobs',
  templateUrl: './processing-queue-jobs.component.html',
  styleUrls: ['./processing-queue-jobs.component.scss'],
})

export class ProcessingQueueJobsComponent implements OnInit {

  @Input() jobs: models.QueuedHyp3Job[];
  @Input() areJobsLoading: boolean;

  @Output() removeJob = new EventEmitter<models.QueuedHyp3Job>();

  public projectName = '';
  public isLoggedIn: boolean;

  public sortTypes = Object.keys(ProcessingQueueJobsSortType).map(key => ProcessingQueueJobsSortType[key]);
  public sortOrders = Object.keys(ProcessingQueueJobsSortOrder).map(key => ProcessingQueueJobsSortOrder[key]);
  public sortOrder: ProcessingQueueJobsSortOrder = ProcessingQueueJobsSortOrder.LATEST;
  public sortType: ProcessingQueueJobsSortType = ProcessingQueueJobsSortType.ACQUISITION;

  public Order = ProcessingQueueJobsSortOrder;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private savedSearchService: services.SavedSearchService,
    private dialogRef: MatDialogRef<ProcessingQueueComponent>,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['jobs']) {
      if(changes['jobs'].previousValue !== changes['jobs'].previousValue) {
        this.jobs = changes['jobs'].currentValue;
      }
    }
  }

  public onProjectNameChange(projectName: string): void {
    this.store$.dispatch(new hyp3Store.SetProcessingProjectName(projectName));
  }

  public onRemoveJob(job: models.QueuedHyp3Job): void {
    this.removeJob.emit(job);
  }

  public viewCustomProducts(event: MouseEvent): void {
    this.store$.dispatch(new searchStore.SetSearchType(SearchType.CUSTOM_PRODUCTS));
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
    if(this.sortType === ProcessingQueueJobsSortType.ACQUISITION) {
      jobs = jobs.sort((a, b) => {
        if(a.granules[0].metadata.date < b.granules[0].metadata.date) {
          return -1;
        } else if(a.granules[0].metadata.date > b.granules[0].metadata.date) {
          return 1;
        }
        return 0;
        });
    }

    if(this.sortOrder === ProcessingQueueJobsSortOrder.LATEST) {
      jobs.reverse();
    }

    return jobs;
  }

}

export enum ProcessingQueueJobsSortOrder {
  OLDEST =  'Oldest',
  LATEST ='Latest'
}
export enum ProcessingQueueJobsSortType {
  ACQUISITION = 'Start Date',
  DATE_ADDED = 'Date Added',
}
