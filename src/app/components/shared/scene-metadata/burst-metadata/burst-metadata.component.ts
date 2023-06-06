import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';
import * as filtersStore from '@store/filters';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { setFullBurst } from '@store/filters';
import * as moment from 'moment';

@Component({
  selector: 'app-burst-metadata',
  templateUrl: './burst-metadata.component.html',
  styleUrls: ['./burst-metadata.component.scss', '../scene-metadata.component.scss']
})
export class BurstMetadataComponent implements OnInit {

  @Input() burst: models.SLCBurstMetadata;
  @Input() groupID: string;
  @Input() sceneName: string;
  @Input() isGeoSearch: boolean;

  constructor(private store$: Store<AppState>) { }

  ngOnInit(): void {
  }

  public setFullBurst(): void {
    this.store$.dispatch(new setFullBurst([this.burst.fullBurstID]))
  }

  public onSetStartDate(date: Date) {
    const startOf = moment(date).startOf('day');
    const startDate = startOf.toDate();
    this.store$.dispatch(new filtersStore.SetStartDate(startDate));
  }

  public onSetEndDate(endDate: Date) {
    this.store$.dispatch(new filtersStore.SetEndDate(endDate));
  }
}
