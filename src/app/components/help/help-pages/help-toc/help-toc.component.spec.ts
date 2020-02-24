import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpTocComponent } from './help-toc.component';

describe('HelpTocComponent', () => {
  let component: HelpTocComponent;
  let fixture: ComponentFixture<HelpTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
