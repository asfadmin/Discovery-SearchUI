import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpListSearchComponent } from './help-list-search.component';

describe('HelpListSearchComponent', () => {
  let component: HelpListSearchComponent;
  let fixture: ComponentFixture<HelpListSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpListSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
