import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<PreferencesComponent>,
  ) { }

  ngOnInit() {
  }
}
