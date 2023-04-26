import { Component, Input, OnInit } from '@angular/core';
import * as models from '@models';
import { Store } from '@ngrx/store';
import { AppState } from '@store';
import { setAbsoluteBurst, setFullBurst, setRelativeBurst } from '@store/filters';

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

  public setRelativeBurst(): void {
    this.store$.dispatch(new setRelativeBurst([this.burst.relativeBurstID]))
  }

  public setAbsoluteBurst(): void {
    this.store$.dispatch(new setAbsoluteBurst([this.burst.absoluteBurstID]))
  }

  public setFullBurst(): void {
    this.store$.dispatch(new setFullBurst([this.burst.fullBurstID]))
  }
}
