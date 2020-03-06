import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as baselineStore from '@store/baseline';

@Component({
  selector: 'app-master-scene-selector',
  templateUrl: './master-scene-selector.component.html',
  styleUrls: ['./master-scene-selector.component.css']
})
export class MasterSceneSelectorComponent implements OnInit, OnDestroy {
  public masterScene: string;
  private subs = new SubSink();

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(baselineStore.getFilterMaster).subscribe(
        master => this.masterScene = master
      )
    );
  }

  public onMasterSceneChanged(master: string): void {
    this.store$.dispatch(new baselineStore.SetFilterMaster(master));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
