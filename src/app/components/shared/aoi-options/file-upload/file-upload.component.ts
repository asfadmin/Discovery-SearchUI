import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { SubSink } from 'subsink';

import { MapInteractionModeType } from '@models';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @Input() interaction$: Observable<MapInteractionModeType>;

  @Output() dialogClose = new EventEmitter<boolean>();
  @Output() newSearchPolygon = new EventEmitter<string>();

  private subs = new SubSink();

  constructor(
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.subs.add(
      this.interaction$.pipe(
        filter(interaction => interaction === MapInteractionModeType.UPLOAD)
      ).subscribe(_ => this.openDialog())
    );
  }

  public openDialog(): void {
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

