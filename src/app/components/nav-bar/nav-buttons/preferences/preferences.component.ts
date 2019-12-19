import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as userStore from '@store/user';

import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  public onClose(): void {
    this.dialogRef.close();
  }
}
