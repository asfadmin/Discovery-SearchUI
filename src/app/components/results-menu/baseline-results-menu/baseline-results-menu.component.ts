import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '@store';
import * as scenesStore from '@store/scenes';

import { Breakpoints } from '@models';
import { ScreenSizeService } from '@services';

import { SubSink } from 'subsink';

enum CardViews {
  LIST = 0,
  DETAIL = 1
}

@Component({
  selector: 'app-baseline-results-menu',
  templateUrl: './baseline-results-menu.component.html',
  styleUrls: ['./baseline-results-menu.component.scss',  '../results-menu.component.scss']
})
export class BaselineResultsMenuComponent implements OnInit, OnDestroy {
  @Input() resize$: Observable<void>;

  public view = CardViews.LIST;
  public Views = CardViews;

  public breakpoint: Breakpoints;
  public breakpoints = Breakpoints;
  private subs = new SubSink();

  constructor(private screenSize: ScreenSizeService) { }

  ngOnInit(): void {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        point => this.breakpoint = point
      )
    );
  }

  public onSelectList(): void {
    this.view = CardViews.LIST;
  }

  public onSelectDetail(): void {
    this.view = CardViews.DETAIL;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
