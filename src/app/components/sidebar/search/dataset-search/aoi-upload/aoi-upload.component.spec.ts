import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoiUploadComponent } from './aoi-upload.component';

describe('AoiUploadComponent', () => {
  let component: AoiUploadComponent;
  let fixture: ComponentFixture<AoiUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoiUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoiUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
