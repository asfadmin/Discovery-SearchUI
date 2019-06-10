import { Component, OnInit } from '@angular/core';
import * as filtersStore from '@store/filters';
import {Store} from '@ngrx/store';
import {AppState} from '@store/app.reducer';
import {MapService} from '@services/map/map.service';
import {WktService} from '@services/wkt.service';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss']
})
export class InfoBarComponent implements OnInit {

  constructor(
    private store$: Store<AppState>,
  ) { }

  ngOnInit() {
  }

  public onNewMaxResults(maxResults: number): void {
    this.store$.dispatch(new filtersStore.SetMaxResults(maxResults));
  }

}
