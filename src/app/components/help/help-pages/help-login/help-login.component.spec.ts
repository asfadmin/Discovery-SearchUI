import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpLoginComponent } from './help-login.component';

describe('HelpLoginComponent', () => {
  let component: HelpLoginComponent;
  let fixture: ComponentFixture<HelpLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
