import { Component, OnInit, OnDestroy } from '@angular/core';
import { ScenesService } from '@services';
import { SubSink } from 'subsink';

import * as models from '@models';
import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-job-product-name-selector',
  templateUrl: './job-product-name-selector.component.html',
  styleUrls: ['./job-product-name-selector.component.scss']
})
export class JobProductNameSelectorComponent implements OnInit, OnDestroy {

  public jobs: models.CMRProduct[];

  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>,
    private scenesService: ScenesService,
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.scenesService.scenes$().subscribe(
        jobs => this.jobs = jobs
      )
    );

  }

  public onFilterProductName(productName: string): void {
    const action = new filtersStore.SetProductNameFilter(productName);
    this.store$.dispatch(action);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
