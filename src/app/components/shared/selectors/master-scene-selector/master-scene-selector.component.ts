import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

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
      this.store$.select(scenesStore.getFilterMaster).subscribe(
        master => this.masterScene = master
      )
    );
  }

  public onMasterSceneChanged(master: string): void {
    this.store$.dispatch(new scenesStore.SetFilterMaster(master));
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
