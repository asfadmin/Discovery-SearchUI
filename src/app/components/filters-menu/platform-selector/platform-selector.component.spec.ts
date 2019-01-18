import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformSelectorComponent } from './platform-selector.component';

describe('PlatformSelectorComponent', () => {
  let component: PlatformSelectorComponent;
  let fixture: ComponentFixture<PlatformSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatformSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatformSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
