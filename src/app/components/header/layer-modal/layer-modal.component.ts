import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as mapStore from '@store/map';

import { AppState } from '@store';

import { MapService, ScreenSizeService } from '@services';
import { Breakpoints } from '@models';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
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


  public breakpoint$ = this.screenSize.breakpoint$;
  public breakpoints = Breakpoints;
  public breakpoint: Breakpoints;

  public style: object = {};
  public dlWidth = 1000;
  public dlHeight = 1000;
  public dlWidthMin = 715;



  private subs = new SubSink();

  public layerArray: {
    label: string;
    id: string;
    description: string;
    docLink: string;
    type: string;
    layerFunction: (param: any) => void;
    sub?: {
      name: string;
      value: string;
    }[];
    asyncValue?: any;
  }[] = [
      {
        'label': 'SENTINEL_1_COHERENCE',
        'id': 'sentinel-1-coherence',
        'description': 'A display of how likely data is to be stable over an area.',
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getCoherenceLayerSelection),
        'type': 'LIST',
        'layerFunction': (param) => { this.mapService.clearCoherence(); this.mapService.setCoherenceLayer(param); this.store$.dispatch(new mapStore.SetCoherenceOverlay(param)) },
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
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getAreGridlinesActive),
        'description': 'Show gridlines over the map. ',
        'layerFunction': (param) => { console.log(param); this.store$.dispatch(new mapStore.SetGridlines(param)) },
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


    // this.mapService.createSampleMap()
    this.mapService.map.setTarget('overlay-map');
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

    this.mapService.map.setTarget('map');
    this.subs.unsubscribe();
  }
}
