// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {MapComponent} from './map.component';
import {Store<AppState>} from '@models';
import {MapService, WktService} from '@services';

describe('MapComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MapComponent
      ],
      providers: [
        Store<AppState>,
        MapService,
        WktService,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // component.ngOnInit();
  });

  it('should run #onNewProjection()', async () => {
    // component.onNewProjection(view);
  });

  it('should run #onNewDrawMode()', async () => {
    // component.onNewDrawMode(mode);
  });

  it('should run #onNewInteractionMode()', async () => {
    // component.onNewInteractionMode(mode);
  });

  it('should run #onFileHovered()', async () => {
    // component.onFileHovered(e);
  });

  it('should run #onNewSearchPolygon()', async () => {
    // component.onNewSearchPolygon(polygon);
  });

  it('should run #onFileUploadDialogClosed()', async () => {
    // component.onFileUploadDialogClosed(successful);
  });

  it('should run #updateMapOnViewChange()', async () => {
    // component.updateMapOnViewChange();
  });

  it('should run #redrawSearchPolygonWhenViewChanges()', async () => {
    // component.redrawSearchPolygonWhenViewChanges();
  });

  it('should run #updateDrawMode()', async () => {
    // component.updateDrawMode();
  });

  it('should run #granulePolygonsLayer()', async () => {
    // const result = component.granulePolygonsLayer(projection);
  });

  it('should run #granulesToFeature()', async () => {
    // const result = component.granulesToFeature(granules, projection);
  });

  it('should run #featuresToSource()', async () => {
    // const result = component.featuresToSource(features);
  });

  it('should run #setMapWith()', async () => {
    // component.setMapWith(viewType);
  });

});
