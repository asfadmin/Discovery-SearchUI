import { async, ComponentFixture, fakeAsync, TestBed, inject, tick } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';

import { Store, StoreModule } from '@ngrx/store';
import * as appStore from '@store';
import { AppState } from '@store';
import { defaultAppState } from '@testing/data';
import { Component, Directive } from '@angular/core';
import { ListSearchComponent } from './list-search.component';
import * as models from '@models';

import { TestStore } from '@testing/services';
import * as filtersStore from '@store/filters';
import * as granulesStore from '@store/granules';

describe('ListSearchComponent', () => {
  let fixture;
  let component;
  let store;
  let dispatchSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        StoreModule.forRoot(appStore.reducers, { metaReducers: appStore.metaReducers }),
      ],
      declarations: [
        ListSearchComponent,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(ListSearchComponent);
    component = fixture.debugElement.componentInstance;
  });

  beforeEach(inject([Store], (testStore: Store<AppState>) => {
    store = testStore;
    dispatchSpy = spyOn(store, 'dispatch');
  }));

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onGranuleModeSelected()', async () => {
    component.onGranuleModeSelected();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new filtersStore.SetListSearchType(models.ListSearchType.GRANULE)
    );
  });

  it('should run #onProductModeSelected()', async () => {
    component.onProductModeSelected();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new filtersStore.SetListSearchType(models.ListSearchType.PRODUCT)
    );
  });

  it('should for list searches, split by spaces, tabs, commas and newlines', async () => {
    const testStr = 'g1 g2,g3\tg4\ng5';
    component.onTextInputChange(testStr);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new granulesStore.SetSearchList(['g1', 'g2', 'g3', 'g4', 'g5'])
    );
  });

  it('should for list searches, only allow unique items', async () => {
    const testStr = 'g1  g2,  g1 \tg2\ng1';
    component.onTextInputChange(testStr);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(
      new granulesStore.SetSearchList(['g1', 'g2'])
    );
  });
});
