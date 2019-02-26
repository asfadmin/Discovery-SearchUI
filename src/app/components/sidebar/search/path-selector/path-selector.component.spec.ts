// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {PathSelectorComponent} from './path-selector.component';

describe('PathSelectorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PathSelectorComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(PathSelectorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onPathStartChanged()', async () => {
    // component.onPathStartChanged(path);
  });

  it('should run #onPathEndChanged()', async () => {
    // component.onPathEndChanged(path);
  });

  it('should run #onFrameStartChanged()', async () => {
    // component.onFrameStartChanged(frame);
  });

  it('should run #onFrameEndChanged()', async () => {
    // component.onFrameEndChanged(frame);
  });

  it('should run #onNewOmitGeoRegion()', async () => {
    // component.onNewOmitGeoRegion(e);
  });

});
