import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  inject,
} from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { MapInteractionModeType } from '@models';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  standalone: false,
})
export class FileUploadComponent implements OnInit, OnDestroy {
  dialog = inject(MatDialog);

  @Input() interaction$: Observable<MapInteractionModeType>;

  @Output() dialogClose = new EventEmitter<boolean>();
  @Output() newSearchPolygon = new EventEmitter<string>();

  private subs = new SubSink();

  public ngOnInit(): void {
    this.subs.add(
      this.interaction$
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
