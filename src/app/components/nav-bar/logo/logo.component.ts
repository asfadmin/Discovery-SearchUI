import { Component, OnInit } from '@angular/core';

import * as uiStore from '@store/ui';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app.reducer';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {
  constructor(private store$: Store<AppState>) {}

  ngOnInit(): void {
  }
}
