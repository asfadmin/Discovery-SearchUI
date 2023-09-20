import { Component, OnInit, OnDestroy, Input, QueryList, ViewChildren } from '@angular/core';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { map} from 'rxjs/operators';
import { Store } from '@ngrx/store';

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
      'description': 'This thing does some pretty cool things and I think it is really really cool.',
      'type': 'LIST',
      'sub': [
        'VV - Dec, Jan, Feb',
        'VV - Mar, Apr, Jun',
        'VV - Mar, Apr, Jun2',
        'VV - Mar, Apr, Jun3',
        'VH - Dec, Jan, Feb',
        'VH - Mar, Apr, Jun',
        'VH - Mar, Apr, Jun2',
        'VH - Mar, Apr, Jun3',
      ]
    },
    {
      'label': 'Browse Overlay',
      'id': 'browse-overlay',
      'description': 'Show a preview of what a product would look like on a map',
      'type': 'TOGGLE'
    }
  ];

  public selectedLayer;

  public
  constructor(
    private store$: Store<AppState>,
    private dialogRef: MatDialogRef<LayerModalComponent>,
    private screenSize: ScreenSizeService,
    private mapService: MapService
  ) {}

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

    this.mapService.createSampleMap()
  }

  public setSelectedLayer(layer) {
    this.selectedLayer = layer;
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
