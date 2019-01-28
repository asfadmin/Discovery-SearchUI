import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MapInteractionModeType } from '@models';

export interface FileUploadData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  animal: string;
  name: string;

  @Input() interaction$: Observable<MapInteractionModeType>;
  @Output() dialogClose = new EventEmitter<void>();

  constructor(public dialog: MatDialog) {}

  public ngOnInit(): void {
    this.interaction$.pipe(
      filter(interaction => interaction === MapInteractionModeType.UPLOAD)
    ).subscribe(_ => this.openDialog());
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadDialogComponent , {
      width: '50%', height: '50%',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      this.dialogClose.emit();
    });
  }
}

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: 'file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileUploadData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
