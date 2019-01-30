import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawSelectorComponent } from './draw-selector.component';

describe('DrawSelectorComponent', () => {
  let component: DrawSelectorComponent;
  let fixture: ComponentFixture<DrawSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
