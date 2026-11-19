import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  input,
  output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubSink } from 'subsink';

import { MapInteractionModeType } from '@models';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);

  readonly interaction$ = input<Observable<MapInteractionModeType>>(undefined);

  readonly dialogClose = output<boolean>();
  readonly newSearchPolygon = output<string>();

  private subs = new SubSink();

  public ngOnInit(): void {
    this.subs.add(
      this.interaction$()
        .pipe(
          filter(
            (interaction) => interaction === MapInteractionModeType.UPLOAD,
          ),
        )
        .subscribe((_) => this.openDialog()),
    );
  }

  public openDialog(): void {
    // Do nothing
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
