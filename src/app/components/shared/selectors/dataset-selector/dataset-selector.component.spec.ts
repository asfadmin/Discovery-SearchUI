import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isDatasetBrowser } from '@angular/common';
import { By } from '@angular/dataset-browser';

import {Component, Directive} from '@angular/core';
import {DatasetSelectorComponent} from './dataset-selector.component';

describe('DatasetSelectorComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatasetSelectorComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(DatasetSelectorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onClick()', async () => {
    // const result = component.onClick(dataset);
  });

});
