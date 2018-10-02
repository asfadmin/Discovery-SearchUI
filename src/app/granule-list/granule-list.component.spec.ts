import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GranuleListComponent } from './granule-list.component';
import { GranuleComponent } from './granule/granule.component';

describe('GranuleListComponent', () => {
    let component: GranuleListComponent;
    let fixture: ComponentFixture<GranuleListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GranuleListComponent, GranuleComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(GranuleListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
