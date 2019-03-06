import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, Component, Directive  } from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
import { TruncateModule } from '@yellowspot/ng-truncate';

import { PipesModule } from '@pipes';
import { GranuleDetailComponent } from './granule-detail.component';

fdescribe('GranuleDetailComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        PipesModule,
        TruncateModule
      ],
      declarations: [
        GranuleDetailComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(GranuleDetailComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onNewQueueProduct()', async () => {
  });

  it('should run #onQueueAllProducts()', async () => {
    // component.onQueueAllProducts();
  });

  it('should run #onSetFocusedGranule()', async () => {
    // component.onSetFocusedGranule(granule);
  });

  it('should run #onClearFocusedGranule()', async () => {
    // component.onClearFocusedGranule();
  });
});
