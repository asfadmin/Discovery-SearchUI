import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, take, combineLatest, switchMap } from 'rxjs';

import {
  ProjectNameDialogComponent,
  ProjectNameDialogData,
} from '@components/shared/project-name-dialog';
import { CMRProduct } from '@models';
import { AppState } from '@store';
import * as hyp3Store from '@store/hyp3';

@Injectable({ providedIn: 'root' })
export class ProjectNameDialogService {
  private dialog = inject(MatDialog);
  private store$ = inject<Store<AppState>>(Store);

  open(
    currentName: string,
    products?: CMRProduct[],
  ): Observable<string | undefined> {
    return combineLatest([
      this.store$.select(hyp3Store.getHyp3User),
      this.store$.select(hyp3Store.getOnDemandUserId),
    ]).pipe(
      take(1),
      switchMap(([hyp3User, filterUserId]) => {
        const dialogRef = this.dialog.open<
          ProjectNameDialogComponent,
          ProjectNameDialogData,
          string
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
