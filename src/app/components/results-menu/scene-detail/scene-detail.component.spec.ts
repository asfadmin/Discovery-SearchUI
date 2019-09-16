import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneDetailComponent } from './scene-detail.component';

describe('SceneDetailComponent', () => {
  let component: SceneDetailComponent;
  let fixture: ComponentFixture<SceneDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SceneDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
