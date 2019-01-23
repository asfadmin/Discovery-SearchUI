import { TestBed, ComponentFixture, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { Component, DebugElement } from '@angular/core';

import { Store } from '@ngrx/store';

import { TestStore } from './testing/store';

import { GranuleListModule } from './granule-list';
import { AppComponent } from './app.component';

import { GranulesState } from './store';
import { SentinelGranule } from './models';


describe('AppComponent', () => {
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    let store: TestStore<GranulesState>;

    const granule = new SentinelGranule(
        'SomeGranule',
        'www.dlurl.com',
        'ACENDING'
    );

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Store, useClass: TestStore },
            ],
            declarations: [
                AppComponent
            ],
            imports: [
                HttpClientTestingModule,
                GranuleListModule
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.debugElement.componentInstance;
    }));

    beforeEach(inject([Store], (testStore: TestStore<GranulesState>) => {
        store = testStore;                            // save store reference for use in tests
        store.setState({ granules: [granule] }); // set default state
    }));

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });
});
