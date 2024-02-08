import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';

import * as models from '@models';

@Component({
  selector: 'app-single-search-type',
  templateUrl: './single-search-type.component.html',
  styleUrl: './single-search-type.component.scss'
})
export class SingleSearchTypeComponent implements OnInit, OnDestroy {
  @Input() public searchTypeSelector: models.SearchTypeSelector;
  @Output() public onOpenDocs = new EventEmitter<Event>();

  public searchTypes = models.SearchType;

  public iconTypes = models.IconType;

  public isLoggedIn = false;
  public isReadMore = true;

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
  ) {}

  ngOnInit() {
    this.subs.add(
      this.store$.select(userStore.getIsUserLoggedIn).subscribe(
        isLoggedIn => this.isLoggedIn = isLoggedIn
      )
    );
  }

  public onOpenDocsClick(event: Event) {
    this.onOpenDocs.emit(event);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
