import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeEnvComponent } from './customize-env.component';

describe('CustomizeEnvComponent', () => {
  let component: CustomizeEnvComponent;
  let fixture: ComponentFixture<CustomizeEnvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeEnvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeEnvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
