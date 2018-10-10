import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GranuleComponent } from './granule.component';

import { SentinelGranule } from '../../models';

describe('GranuleComponent', () => {
    let component: GranuleComponent;
    let fixture: ComponentFixture<GranuleComponent>;

    const granule = new SentinelGranule(
        'SomeGranule',
        'www.dlurl.com',
        'ACENDING'
    );

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GranuleComponent ]
        }).compileComponents();

        fixture = TestBed.createComponent(GranuleComponent);
        component = fixture.componentInstance;

        component.granule = granule;
        fixture.detectChanges();

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
