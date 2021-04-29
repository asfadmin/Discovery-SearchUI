import { Component, OnInit, Inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import { SearchType } from '@models';

import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-queue-submit',
  templateUrl: './queue-submit.component.html',
  styleUrls: ['./queue-submit.component.scss']
})
export class QueueSubmitComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private store$: Store<AppState>,
    private _bottomSheetRef: MatBottomSheetRef<QueueSubmitComponent>
  ) {}

  ngOnInit(): void {
  }

  viewCustomProducts(event: MouseEvent): void {
    this.store$.dispatch(new searchStore.SetSearchType(SearchType.CUSTOM_PRODUCTS));

    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
