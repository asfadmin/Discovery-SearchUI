import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributionsComponent } from './attributions.component';

describe('AttributionsComponent', () => {
  let component: AttributionsComponent;
  let fixture: ComponentFixture<AttributionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
