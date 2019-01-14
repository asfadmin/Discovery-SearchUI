import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductNameComponent } from './product-name.component';

describe('ProductNameComponent', () => {
  let component: ProductNameComponent;
  let fixture: ComponentFixture<ProductNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
