// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isDatasetBrowser } from '@angular/common';
import { By } from '@angular/dataset-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {OtherSelectorComponent} from './other-selector.component';

describe('OtherSelectorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        OtherSelectorComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(OtherSelectorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onNewDatasetBeamModes()', async () => {
    // component.onNewDatasetBeamModes(dataset, beamModes);
  });

  it('should run #onNewProductTypes()', async () => {
    // component.onNewProductTypes(dataset, productTypes);
  });

  it('should run #onNewFlightDirectionsSelected()', async () => {
    // component.onNewFlightDirectionsSelected(directions);
  });

  it('should run #onNewDatasetPolarizations()', async () => {
    // component.onNewDatasetPolarizations(dataset, polarizations);
  });

});
