import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isDatasetBrowser } from '@angular/common';
import { By } from '@angular/dataset-browser';

import {Component, Directive} from '@angular/core';
import {PathSelectorComponent} from './path-selector.component';

describe('PathSelectorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
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
    let path: number;
    component.newPathStart.subscribe((newPath) => path = newPath);

    const result = component.onPathStartChanged('1');

    expect(path).toBe(1);
  });

  it('should run #onPathEndChanged()', async () => {
    let path: number;
    component.newPathEnd.subscribe((newPath) => path = newPath);

    const result = component.onPathEndChanged('1');

    expect(path).toBe(1);
  });

  it('should run #onFrameStartChanged()', async () => {
    let frame: number;
    component.newFrameStart.subscribe((newFrame) => frame = newFrame);

    const result = component.onFrameStartChanged('1');

    expect(frame).toBe(1);
  });

  it('should run #onFrameEndChanged()', async () => {
    let frame: number;
    component.newFrameEnd.subscribe((newFrame) => frame = newFrame);

    const result = component.onFrameEndChanged('1');

    expect(frame).toBe(1);
  });

  it('should run #onNewOmitGeoRegion()', async () => {
    // component.onNewOmitGeoRegion(e);
    let shouldOmit: boolean;
    component.newOmitSearchPolygon.subscribe((newShouldOmit) => shouldOmit = newShouldOmit);

    const result = component.onNewOmitPolygon({ checked: true });

    expect(shouldOmit).toBe(true);
  });
});
