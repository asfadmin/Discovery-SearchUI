import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, take, combineLatest, switchMap } from 'rxjs';

import {
  ProjectNameDialogComponent,
  ProjectNameDialogData,
  ProjectNameDialogResult,
} from '@components/shared/project-name-dialog';
import { CMRProduct } from '@models';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';

@Injectable({ providedIn: 'root' })
export class ProjectNameDialogService {
  private dialog = inject(MatDialog);
  private store$ = inject<Store<AppState>>(Store);

  /**
   * Opens the project name dialog.
   *
   * When products are provided (bulk rename), the dialog handles the rename
   * operation internally and returns ProjectNameDialogResult.
   *
   * When no products are provided (single-file rename), the dialog just
   * returns the new name as a string.
   */
  open(
    currentName: string,
    products?: CMRProduct[],
  ): Observable<string | ProjectNameDialogResult | undefined> {
    return combineLatest([
      this.store$.select(hyp3Store.getHyp3User),
      this.store$.select(hyp3Store.getOnDemandUserId),
    ]).pipe(
      take(1),
      switchMap(([hyp3User, filterUserId]) => {
        const dialogRef = this.dialog.open<
          ProjectNameDialogComponent,
          ProjectNameDialogData,
          string | ProjectNameDialogResult
        >(ProjectNameDialogComponent, {
          width: '400px',
          data: {
            currentName,
            products,
            loggedInUserId: hyp3User?.user_id,
            filterUserId: filterUserId || undefined,
          },
        });

        return dialogRef.afterClosed();
      }),
    );
  }
}
