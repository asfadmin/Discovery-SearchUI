import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/dataset-browser/animations';

import { AoiUploadComponent } from './aoi-upload.component';
import { AoiUploadModule } from './aoi-upload.module';

describe('AoiUploadComponent', () => {
  let component: AoiUploadComponent;
  let fixture: ComponentFixture<AoiUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        AoiUploadModule
      ]
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
