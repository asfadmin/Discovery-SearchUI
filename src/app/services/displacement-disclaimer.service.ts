import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { DispDataDisclaimerComponent } from '@components/results-menu/timeseries-results-menu/timeseries-displacement-disclaimer-dialog.component';

@Injectable({ providedIn: 'root' })
export class DisplacementDisclaimerService {
  private dialog = inject(MatDialog);

  open(): Observable<void> {
    return this.dialog
      .open(DispDataDisclaimerComponent, {
        width: '550px',
        height: '325px',
        maxWidth: '550px',
        maxHeight: '500px',
      })
      .afterClosed();
  }
}
