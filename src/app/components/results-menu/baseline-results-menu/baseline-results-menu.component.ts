import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';


@Component({
  selector: 'app-baseline-results-menu',
  templateUrl: './baseline-results-menu.component.html',
  styleUrls: ['./baseline-results-menu.component.scss',  '../results-menu.component.scss']
})
export class BaselineResultsMenuComponent implements OnInit {
  @Input() resize$: Observable<void>;

  constructor() { }

  ngOnInit(): void {
  }
}
