import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFileButtonComponent } from './download-file-button.component';

describe('DownloadFileButtonComponent', () => {
  let component: DownloadFileButtonComponent;
  let fixture: ComponentFixture<DownloadFileButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadFileButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadFileButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
