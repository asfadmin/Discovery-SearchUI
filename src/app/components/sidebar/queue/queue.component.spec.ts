// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {QueueComponent} from './queue.component';

describe('QueueComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        QueueComponent
      ],
      providers: [
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #onRemoveProduct()', async () => {
    // component.onRemoveProduct(product);
  });

  it('should run #onClearQueue()', async () => {
    // component.onClearQueue();
  });

  it('should run #onMakeDownloadScript()', async () => {
    // component.onMakeDownloadScript();
  });

  it('should run #onCsvDownload()', async () => {
    // component.onCsvDownload();
  });

  it('should run #onKmlDownload()', async () => {
    // component.onKmlDownload();
  });

  it('should run #onGeojsonDownload()', async () => {
    // component.onGeojsonDownload();
  });

  it('should run #onMetalinkDownload()', async () => {
    // component.onMetalinkDownload();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
