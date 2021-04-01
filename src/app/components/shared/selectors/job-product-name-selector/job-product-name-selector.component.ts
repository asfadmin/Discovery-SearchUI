import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SubSink } from 'subsink';

import * as filtersStore from '@store/filters';
import { AppState } from '@store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-job-product-name-selector',
  templateUrl: './job-product-name-selector.component.html',
  styleUrls: ['./job-product-name-selector.component.scss']
})
export class JobProductNameSelectorComponent implements OnInit, OnDestroy {
  @Input() headerView: boolean;
  public productNameFilter: string;
  private subs = new SubSink();

  constructor(
    private store$: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.subs.add(
      this.store$.select(filtersStore.getProductNameFilter).subscribe(
        productNameFilter => this.productNameFilter = productNameFilter
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
