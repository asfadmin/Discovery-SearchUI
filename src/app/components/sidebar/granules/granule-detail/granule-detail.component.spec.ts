// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {GranuleDetailComponent} from './granule-detail.component';

describe('GranuleDetailComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
    // component.onNewQueueProduct(product);
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
