import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
  styleUrls: ['./processing-queue-jobs.component.scss']
})
export class ProcessingQueueJobsComponent implements OnInit {
  @Input() jobs: models.QueuedHyp3Job[];
  @Input() areJobsLoading: boolean;

  @Output() removeJob = new EventEmitter<models.QueuedHyp3Job>();

  public projectName = '';
  public isLoggedIn: boolean;

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

}
