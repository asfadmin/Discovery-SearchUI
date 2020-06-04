import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpMoreLikeThisComponent } from './help-more-like-this.component';

describe('MoreLikeThisComponent', () => {
  let component: HelpMoreLikeThisComponent;
  let fixture: ComponentFixture<HelpMoreLikeThisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpMoreLikeThisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpMoreLikeThisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
