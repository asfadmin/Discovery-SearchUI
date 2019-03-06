import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';

import { Component, Directive } from '@angular/core';
import { ListSearchComponent } from './list-search.component';
import * as models from '@models';

describe('ListSearchComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        ListSearchComponent,
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(ListSearchComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onGranuleModeSelected()', async () => {
    let listType: models.ListSearchType;

    component.newListSearchMode.subscribe(newlistType => listType = newlistType);
    component.onGranuleModeSelected();

    expect(listType).toEqual(models.ListSearchType.GRANULE);
  });

  it('should run #onProductModeSelected()', async () => {
    let listType: models.ListSearchType;

    component.newListSearchMode.subscribe(newlistType => listType = newlistType);
    component.onProductModeSelected();

    expect(listType).toEqual(models.ListSearchType.PRODUCT);
  });

  it('should for list searches, split by spaces, tabs, commas and newlines', async () => {
    let items: string[];

    component.newListSearch.subscribe(newItems => items = newItems);
    const testStr = 'g1 g2,g3\tg4\ng5';
    component.onTextInputChange(testStr);

    expect(items).toEqual(['g1', 'g2', 'g3', 'g4', 'g5']);
  });

  it('should for list searches, only allow unique items', async () => {
    let items: string[];

    component.newListSearch.subscribe(newItems => items = newItems);
    const testStr = 'g1  g2,  g1 \tg2\ng1';
    component.onTextInputChange(testStr);

    expect(items).toEqual(['g1', 'g2']);
  });
});
