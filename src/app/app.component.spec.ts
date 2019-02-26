// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { By } from '@angular/platform-browser';
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/observable/throw';

import {Component, Directive} from '@angular/core';
import {AppComponent} from './app.component';
import {Store<AppState>, MatBottomSheet, services.MapService, services.UrlStateService, services.PolygonValidationService} from './models';

@Injectable()
class MockStore<AppState> { }

@Injectable()
class MockMatBottomSheet { }

@Injectable()
class Mockservices.MapService { }

@Injectable()
class Mockservices.UrlStateService { }

@Injectable()
class Mockservices.PolygonValidationService { }

describe('AppComponent', () => {
  let fixture;
  let component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: Store<AppState>, useClass: MockStore<AppState>},
        {provide: MatBottomSheet, useClass: MockMatBottomSheet},
        {provide: services.MapService, useClass: Mockservices.MapService},
        {provide: services.UrlStateService, useClass: Mockservices.UrlStateService},
        {provide: services.PolygonValidationService, useClass: Mockservices.PolygonValidationService},
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should create a component', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    // component.ngOnInit();
  });

  it('should run #onLoadUrlState()', async () => {
    // component.onLoadUrlState();
  });

  it('should run #onOpenSpreadsheet()', async () => {
    // component.onOpenSpreadsheet();
  });

  it('should run #onNewSearch()', async () => {
    // component.onNewSearch();
  });

  it('should run #onClearSearch()', async () => {
    // component.onClearSearch();
  });

});
