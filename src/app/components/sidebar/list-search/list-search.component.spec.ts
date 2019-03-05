// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {ListSearchComponent} from './list-search.component';

describe('ListSearchComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListSearchComponent
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
    // component.onGranuleModeSelected();
  });

  it('should run #onProductModeSelected()', async () => {
    // component.onProductModeSelected();
  });

  it('should run #onTextInputChange()', async () => {
    // component.onTextInputChange(text);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
