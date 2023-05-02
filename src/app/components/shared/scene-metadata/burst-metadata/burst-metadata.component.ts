import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { setFullBurst } from '@store/filters';

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
}
