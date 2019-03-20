import { async, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { Store, StoreModule } from '@ngrx/store';
import * as appStore from '@store';
import * as queueStore from '@store/queue';
import { AsfApiOutputFormat } from '@models';

import { testProduct, queueState } from '@testing/data';
import { TestStore } from '@testing/services';

import { QueueComponent, QueueModule } from '.';

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture;
  let store;
  let dispatchSpy;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        QueueModule,
        BrowserModule,
        StoreModule.forRoot(appStore.reducers, { metaReducers: appStore.metaReducers }),
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.debugElement.componentInstance;
  }));

  beforeEach(inject([Store], (testStore: Store<queueStore.QueueState>) => {
    store = testStore;
    dispatchSpy = spyOn(store, 'dispatch');
  }));

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onRemoveProduct()', async () => {
    component.onRemoveProduct(testProduct);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.RemoveItem(testProduct)
    );
  });

  it('should run #onClearQueue()', async () => {
    component.onClearQueue();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.ClearQueue()
    );
  });

  it('should run #onMakeDownloadScript()', async () => {
    component.onMakeDownloadScript();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.MakeDownloadScript()
    );
  });

  it('should run #onCsvDownload()', async () => {
    component.onCsvDownload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.DownloadMetadata(AsfApiOutputFormat.CSV)
    );
  });

  it('should run #onKmlDownload()', async () => {
    component.onKmlDownload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.DownloadMetadata(AsfApiOutputFormat.KML)
    );
  });

  it('should run #onGeojsonDownload()', async () => {
    component.onGeojsonDownload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.DownloadMetadata(AsfApiOutputFormat.GEOJSON)
    );
  });

  it('should run #onMetalinkDownload()', async () => {
    component.onMetalinkDownload();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new queueStore.DownloadMetadata(AsfApiOutputFormat.METALINK)
    );
  });
});
