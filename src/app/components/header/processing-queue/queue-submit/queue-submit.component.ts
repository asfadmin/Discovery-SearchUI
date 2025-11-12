import { Component, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as searchStore from '@store/search';
import { SearchType } from '@models';

import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-queue-submit',
  templateUrl: './queue-submit.component.html',
  styleUrls: ['./queue-submit.component.scss'],
  standalone: false,
})
export class QueueSubmitComponent {
  data = inject(MAT_BOTTOM_SHEET_DATA);
  private store$ = inject<Store<AppState>>(Store);
  private _bottomSheetRef =
    inject<MatBottomSheetRef<QueueSubmitComponent>>(MatBottomSheetRef);

  viewCustomProducts(event: MouseEvent): void {
    this.store$.dispatch(
      new searchStore.SetSearchType(SearchType.CUSTOM_PRODUCTS),
    );

    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }
}
