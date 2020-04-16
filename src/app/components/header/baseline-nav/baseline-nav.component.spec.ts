import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineNavComponent } from './baseline-nav.component';

describe('BaselineNavComponent', () => {
  let component: BaselineNavComponent;
  let fixture: ComponentFixture<BaselineNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselineNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselineNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
