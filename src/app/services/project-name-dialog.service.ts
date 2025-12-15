import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import {
  ProjectNameDialogComponent,
  ProjectNameDialogData,
} from '@components/shared/project-name-dialog';

@Injectable({ providedIn: 'root' })
export class ProjectNameDialogService {
  private dialog = inject(MatDialog);

  open(currentName: string): Observable<string | undefined> {
    const dialogRef = this.dialog.open<
      ProjectNameDialogComponent,
      ProjectNameDialogData,
      string
    >(ProjectNameDialogComponent, {
      width: '400px',
      data: { currentName },
    });

    return dialogRef.afterClosed();
  }
}
