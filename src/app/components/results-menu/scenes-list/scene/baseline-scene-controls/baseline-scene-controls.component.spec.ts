import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselineSceneControlsComponent } from './baseline-scene-controls.component';

describe('BaselineSceneControlsComponent', () => {
  let component: BaselineSceneControlsComponent;
  let fixture: ComponentFixture<BaselineSceneControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaselineSceneControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaselineSceneControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
