import { Component, OnInit, OnDestroy, Input, QueryList, ViewChildren } from '@angular/core';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as mapStore from '@store/map';

import { AppState } from '@store';

import { MapService, ScreenSizeService } from '@services';
import { Breakpoints } from '@models';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import * as userStore from '@store/user';
import { DownloadFileButtonComponent } from '@components/shared/download-file-button/download-file-button.component';
import * as UAParser from 'ua-parser-js';
import { ResizedEvent } from '@directives/resized.directive';

export interface selectedItems {
  id: string;
  url: string;
}

@Component({
  selector: 'app-layer-modal',
  templateUrl: './layer-modal.component.html',
  styleUrls: ['./layer-modal.component.scss']
})
export class LayerModalComponent implements OnInit, OnDestroy {

  @Input() appQueueComponentModel: string;


  @ViewChildren(DownloadFileButtonComponent) downloadButtons !: QueryList<DownloadFileButtonComponent>;

  public copyIcon = faCopy;
  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public breakpoint: Breakpoints;

  public style: object = {};
  public dlWidth = 1000;
  public dlHeight = 1000;
  public dlWidthMin = 715;

  public selectedItems: selectedItems[] = [];
  public allChecked = false;
  public someChecked = false;

  public dlQueueCount = 0;
  public dlQueueNumProcessed = 0;
  public dlDefaultChunkSize = 3;
  public dlQueueProgress = 0;
  public productList: DownloadFileButtonComponent[] = [];
  public isLoggedIn$ = this.store$.select(userStore.getIsUserLoggedIn).pipe(
    map(
      loggedIn => loggedIn && new UAParser().getBrowser().name === 'Chrome'
    )
  );

  private subs = new SubSink();

  public layerArray = [
    {
      'label': 'Sentinel 1 Coherence',
      'id': 'sentinel-1-coherence',
      'description': 'These show the general data about .',
      'doc_link': '',
      'type': 'LIST',
      'layerFunction': (param) => { this.mapService.clearCoherence(); this.mapService.setCoherenceLayer(param) },
      'sub': [
        {
          'name': 'VV - Dec, Jan, Feb',
          'value': 'VV_DEC_JAN_FEB'
        },
        {
          'name': 'VV - Mar, Apr, May',
          'value': 'VV_MAR_APR_MAY'
        },
        {
          'name': 'VV - Jun, Jul, Aug',
          'value': 'VV_JUN_JUL_AUG'
        },
        {
          'name': 'VV - Sep, Oct, Nov',
          'value': 'VV_SEP_OCT_NOV'
        },
        {
          'name': 'VH - Dec, Jan, Feb',
          'value': 'Vh_DEC_JAN_FEB'
        },
        {
          'name': 'VH - Mar, Apr, May',
          'value': 'VH_MAR_APR_MAY'
        },
        {
          'name': 'VH - Jun, Jul, Aug',
          'value': 'VH_JUN_JUL_AUG'
        },
        {
          'name': 'VH - Sep, Oct, Nov',
          'value': 'VH_SEP_OCT_NOV'
        },
      ]
    },
    {
      'label': 'Gridlines',
      'id': 'gridlines',
      'async-value': this.store$.select(mapStore.getAreGridlinesActive),
      'description': 'Show gridlines over the map. ',
      'layerFunction': (param) => { console.log(param); this.store$.dispatch(new mapStore.SetGridlines(param))},
      'type': 'TOGGLE'
    }
  ];

  public selectedLayer;

  public
  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<LayerModalComponent>,
    private screenSize: ScreenSizeService,
    private mapService: MapService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );

    this.subs.add(
      this.store$.select(userStore.getUserProfile).subscribe(
        profile => {
          this.dlDefaultChunkSize = profile.defaultMaxConcurrentDownloads;
        }
      )
    );

    // this.mapService.createSampleMap()
  }

  public setSelectedLayer(layer) {
    this.selectedLayer = layer;
  }

  public onOptionSelect(option, selectedLayer) {
    console.log(option)
    selectedLayer.layerFunction(option);
  }


  public onResized(event: ResizedEvent) {
    this.dlWidth = event.newRect.width;
    this.dlHeight = event.newRect.height;
  }
  onCloseDownloadQueue() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
