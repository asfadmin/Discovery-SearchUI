import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpNewStuffComponent } from './help-new-stuff.component';

describe('HelpNewStuffComponent', () => {
  let component: HelpNewStuffComponent;
  let fixture: ComponentFixture<HelpNewStuffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpNewStuffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpNewStuffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
