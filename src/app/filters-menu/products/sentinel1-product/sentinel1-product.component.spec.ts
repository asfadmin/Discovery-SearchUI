import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Sentinel1ProductComponent } from './sentinel1-product.component';

describe('Sentinel1ProductComponent', () => {
  let component: Sentinel1ProductComponent;
  let fixture: ComponentFixture<Sentinel1ProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Sentinel1ProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Sentinel1ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
