import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import * as mapStore from '@store/map';

import { AppState } from '@store';

import { DrawService, LayerService, MapService, ScreenSizeService } from '@services';
import { Breakpoints, MapInteractionModeType } from '@models';
import { MatDialogRef } from '@angular/material/dialog';
import { SubSink } from 'subsink';
import { ResizedEvent } from '@directives/resized.directive';

import * as models from '@models';
import { map } from 'rxjs';


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
    opacity? : {
      set: (param: any) => void;
      value: any
    }
    type: string;
    layerFunction: (param: any) => void;
    sub?: {
      name: string;
      value: string;
    }[];
    asyncValue?: any;
  }[] = [
      {
        'label': 'Sentinel 1 Coherence',
        'id': 'sentinel-1-coherence',
        'description': 'Shows the coherence over locations.',
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getCoherenceLayerSelection),
        'opacity': {
          'set': (value) => this.store$.dispatch(new mapStore.SetCoherenceOverlayOpacity(value)),
          'value': this.store$.select(mapStore.getCoherenceOverlayOpacity)
        },
        'type': 'LIST',
        'layerFunction': (param) => { this.mapService.clearCoherence();this.mapService.addLayer('coherence-' + param, this.layerService.getCoherenceLayer(param)); this.store$.dispatch(new mapStore.SetCoherenceOverlay(param)) },
        'sub': [
          {
            'name': '12 Day VV - Dec, Jan, Feb',
            'value': 'VV_DEC_JAN_FEB'
          },
          {
            'name': '12 Day VV - Mar, Apr, May',
            'value': 'VV_MAR_APR_MAY'
          },
          {
            'name': '12 Day VV - Jun, Jul, Aug',
            'value': 'VV_JUN_JUL_AUG'
          },
          {
            'name': '12 Day VV - Sep, Oct, Nov',
            'value': 'VV_SEP_OCT_NOV'
          },
          {
            'name': '12 Day HH - Dec, Jan, Feb',
            'value': 'Vh_DEC_JAN_FEB'
          },
          {
            'name': '12 Day HH - Mar, Apr, May',
            'value': 'VH_MAR_APR_MAY'
          },
          {
            'name': '12 Day HH - Jun, Jul, Aug',
            'value': 'VH_JUN_JUL_AUG'
          },
          {
            'name': '12 Day HH - Sep, Oct, Nov',
            'value': 'VH_SEP_OCT_NOV'
          },
        ]
      },
      {
        'label': 'Gridlines',
        'id': 'gridlines',
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getAreGridlinesActive),
        'description': 'Show longitude and latitude on map.',
        'layerFunction': (param) => { console.log(param); this.store$.dispatch(new mapStore.SetGridlines(param)) },
        'type': 'TOGGLE'
      },
      {
        'label': 'Street Map',
        'id': 'street-map',
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getMapLayerType).pipe(map(layerType => layerType === models.MapLayerTypes.STREET)),
        'description': 'Show streets and street names.',
        'layerFunction': (param) => {    const action = param ?
          new mapStore.SetStreetView() :
          new mapStore.SetSatelliteView(); console.log(param); this.store$.dispatch(action) },
        'type': 'TOGGLE'
      },
      {
        'label': 'Overview Map',
        'id': 'overview-map',
        'docLink': '',
        'asyncValue': this.store$.select(mapStore.getIsOverviewMapOpen),
        'description': 'Show a minimap of overral placement on the globe.',
        'layerFunction': (param) => { this.store$.dispatch(new mapStore.ToggleOverviewMap(param)) },
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
    private drawService: DrawService,
    private layerService: LayerService,
  ) { }

  ngOnInit() {
    this.subs.add(
      this.screenSize.breakpoint$.subscribe(
        breakpoint => this.breakpoint = breakpoint
      )
    );


    this.mapService.map.setTarget('overlay-map');
    this.mapService.disableInteractions();
    this.drawService.getLayer().setVisible(false);
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.NONE));

    this.setSelectedLayer(this.layerArray[0])
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
    this.mapService.enableInteractions();
    this.store$.dispatch(new mapStore.SetMapInteractionMode(MapInteractionModeType.DRAW));
    this.drawService.getLayer().setVisible(true);
    this.subs.unsubscribe();
  }
}
