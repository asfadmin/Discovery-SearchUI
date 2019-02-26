// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {SpreadsheetComponent} from './spreadsheet.component';
import {Store<AppState>} from '@models';

describe('SpreadsheetComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpreadsheetComponent
      ],
      providers: [
        Store<AppState>,
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(SpreadsheetComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onRowHover()', async () => {
    // const result = component.onRowHover(row);
  });

  it('should run #filterObject()', async () => {
    // const result = component.filterObject(allowedKeys, product);
  });

  it('should run #onRemoveColumn()', async () => {
    // component.onRemoveColumn(columnToRemove);
  });

  it('should run #onColumnsReset()', async () => {
    // component.onColumnsReset();
  });

  it('should run #onHideSpreadsheet()', async () => {
    // component.onHideSpreadsheet();
  });

  it('should run #applyFilter()', async () => {
    // const result = component.applyFilter(filterValue);
  });

  it('should run #isAllSelected()', async () => {
    // const result = component.isAllSelected();
  });

  it('should run #masterToggle()', async () => {
    // const result = component.masterToggle();
  });

});
