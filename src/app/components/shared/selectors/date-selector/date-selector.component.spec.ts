// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material'
import { isDatasetBrowser } from '@angular/common';
import { By } from '@angular/dataset-browser';

import {Component, Directive} from '@angular/core';
import {DateSelectorComponent} from './date-selector.component';

describe('DateSelectorComponent', () => {
  const testDate = new Date(2018, 11, 24, 10, 33, 30, 0);
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [
        DateSelectorComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(DateSelectorComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onStartDateChange()', async () => {
    let date: Date;
    component.newStart.subscribe((newDate) => date = newDate);

    const result = component.onStartDateChange({value: testDate});

    expect(date).toBe(testDate);
  });

  it('should run #onEndDateChange()', async () => {
    let date: Date;
    component.newEnd.subscribe((newDate) => date = newDate);

    const result = component.onEndDateChange({value: testDate});

    expect(date).toBe(testDate);
  });
});
