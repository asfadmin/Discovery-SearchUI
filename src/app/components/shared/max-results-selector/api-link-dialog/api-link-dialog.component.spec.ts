import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiLinkDialogComponent } from './api-link-dialog.component';

describe('ApiLinkDialogComponent', () => {
  let component: ApiLinkDialogComponent;
  let fixture: ComponentFixture<ApiLinkDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiLinkDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
