import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneControlsComponent } from './scene-controls.component';

describe('SceneControlsComponent', () => {
  let component: SceneControlsComponent;
  let fixture: ComponentFixture<SceneControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
