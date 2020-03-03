import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as baselineStore from '@store/baseline';

@Component({
  selector: 'app-master-scene-selector',
  templateUrl: './master-scene-selector.component.html',
  styleUrls: ['./master-scene-selector.component.css']
})
export class MasterSceneSelectorComponent implements OnInit {
  public masterScene: string;

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
    this.store$.select(baselineStore.getMasterGranule).subscribe(
      master => this.masterScene = master
    );
  }

  public onMasterSceneChanged(master: string): void {
    this.store$.dispatch(new baselineStore.SetMaster(master));
  }
}
