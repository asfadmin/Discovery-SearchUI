import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';

@Component({
    selector: 'app-on-demand-user-selector',
    templateUrl: './on-demand-user-selector.component.html',
    styleUrls: ['./on-demand-user-selector.component.scss'],
    standalone: false
})
export class OnDemandUserSelectorComponent implements OnInit, OnDestroy {
  private store$ = inject<Store<AppState>>(Store);

  public onDemandUserName = '';
  private subs = new SubSink();

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(hyp3Store.getOnDemandUserId).subscribe((name) => {
        this.onDemandUserName = name;
      }),
    );
  }

  public onOnDemandUserChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const userID = input.value;

    this.onDemandUserName = userID;

    this.store$.dispatch(new hyp3Store.SetOnDemandUserID(userID));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
