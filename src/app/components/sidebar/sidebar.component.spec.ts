// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {SidebarComponent} from './sidebar.component';
import {DateExtremaService, Router, Store<AppState>} from '@models';

@Injectable();
class MockRouter { navigate = jest.fn(); }

describe('SidebarComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent
      ],
      providers: [
        DateExtremaService,
        {provide: Router, useClass: MockRouter},
        Store<AppState>,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onAppReset()', async () => {
    // const result = component.onAppReset();
  });

  it('should run #onOpenSpreadsheet()', async () => {
    // component.onOpenSpreadsheet();
  });

  it('should run #onPlatformRemoved()', async () => {
    // component.onPlatformRemoved(platformName);
  });

  it('should run #onPlatformAdded()', async () => {
    // component.onPlatformAdded(platformName);
  });

  it('should run #onNewFilterSelected()', async () => {
    // component.onNewFilterSelected(selectedFilter);
  });

  it('should run #onToggleHide()', async () => {
    // component.onToggleHide();
  });

  it('should run #onNewSearch()', async () => {
    // component.onNewSearch();
  });

  it('should run #onClearSearch()', async () => {
    // component.onClearSearch();
  });

  it('should run #onNewStartDate()', async () => {
    // component.onNewStartDate(start);
  });

  it('should run #onNewEndDate()', async () => {
    // component.onNewEndDate(end);
  });

  it('should run #onNewGranuleSelected()', async () => {
    // component.onNewGranuleSelected(name);
  });

  it('should run #onNewPathStart()', async () => {
    // component.onNewPathStart(path);
  });

  it('should run #onNewPathEnd()', async () => {
    // component.onNewPathEnd(path);
  });

  it('should run #onNewFrameStart()', async () => {
    // component.onNewFrameStart(frame);
  });

  it('should run #onNewFrameEnd()', async () => {
    // component.onNewFrameEnd(frame);
  });

  it('should run #onNewGranuleList()', async () => {
    // component.onNewGranuleList(searchList);
  });

  it('should run #onNewOmitGeoRegion()', async () => {
    // component.onNewOmitGeoRegion(shouldOmitGeoRegion);
  });

  it('should run #onNewListSearchMode()', async () => {
    // component.onNewListSearchMode(mode);
  });

  it('should run #onClearQueue()', async () => {
    // component.onClearQueue();
  });

  it('should run #onRemoveItem()', async () => {
    // component.onRemoveItem(product);
  });

  it('should run #onNewQueueItem()', async () => {
    // component.onNewQueueItem(product);
  });

  it('should run #onNewQueueItems()', async () => {
    // component.onNewQueueItems(products);
  });

  it('should run #onMakeDownloadScript()', async () => {
    // component.onMakeDownloadScript();
  });

  it('should run #onMetadataDownload()', async () => {
    // component.onMetadataDownload(format);
  });

  it('should run #onQueueGranuleProducts()', async () => {
    // component.onQueueGranuleProducts(name);
  });

  it('should run #onNewProductTypes()', async () => {
    // component.onNewProductTypes(productTypes);
  });

  it('should run #onNewFlightDirections()', async () => {
    // component.onNewFlightDirections(directions);
  });

  it('should run #onNewBeamModes()', async () => {
    // component.onNewBeamModes(platformBeamModes);
  });

  it('should run #onNewPolarizations()', async () => {
    // component.onNewPolarizations(platformPolarizations);
  });

  it('should run #onNewFocusedGranule()', async () => {
    // component.onNewFocusedGranule(granule);
  });

  it('should run #onClearFocusedGranule()', async () => {
    // component.onClearFocusedGranule();
  });

  it('should run #onNewMaxResults()', async () => {
    // component.onNewMaxResults(maxResults);
  });

});
