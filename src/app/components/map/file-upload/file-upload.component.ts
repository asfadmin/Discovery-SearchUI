import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as uiStore from '@store/ui';
import * as searchStore from '@store/search';

import { MatDialog } from '@angular/material/dialog';

import { MapInteractionModeType, SearchType } from '@models';
import { FileUploadDialogComponent } from './file-upload-dialog';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() interaction$: Observable<MapInteractionModeType>;

  @Output() dialogClose = new EventEmitter<boolean>();
  @Output() newSearchPolygon = new EventEmitter<string>();

  private searchType: SearchType;

  constructor(
    private store$: Store<AppState>,
    public dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.interaction$.pipe(
      filter(interaction => interaction === MapInteractionModeType.UPLOAD)
    ).subscribe(_ => this.openDialog());

    this.store$.select(searchStore.getSearchType).subscribe(
      searchType => this.searchType = searchType
    );
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent , {
      width: '550px', height: '700px', minHeight: '50%'
    });

    dialogRef.afterClosed().subscribe(
      wkt => {
        let wasSuccessful: boolean;

        if (wkt) {
          if (this.searchType === SearchType.LIST) {
            this.store$.dispatch(new searchStore.ClearSearch());
            this.store$.dispatch(new searchStore.SetSearchType(SearchType.DATASET));
          }

          this.newSearchPolygon.emit(wkt);
          this.store$.dispatch(new uiStore.CloseAOIOptions());
          wasSuccessful = true;
        } else {
          wasSuccessful = false;
        }

        this.dialogClose.emit(wasSuccessful);
      }
    );
  }
}

