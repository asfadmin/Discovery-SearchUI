import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastrModule } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';

import { GranuleListSelectorComponent } from './granule-list-selector.component';
import testProviders from '@testing/providers';

describe('SceneFilesComponent', () => {
  let component: GranuleListSelectorComponent;
  let fixture: ComponentFixture<GranuleListSelectorComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GranuleListSelectorComponent,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
        }),
      ],
      providers: [...testProviders],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GranuleListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should be invalid for lists with >5 leading wildcards', () => {
    component.granuleListModel.set({
      list: '*1A, *1B, *1C, ?1D, *1E, *1F',
    });
    expect(component.granuleListForm().invalid()).toBeTruthy();
  });

  it('should be valid for lists with <=5 leading wildcards', () => {
    component.granuleListModel.set({
      list: '*1A, *1B, *1C, ?1D, *1E',
    });
    expect(component.granuleListForm().invalid()).toBeFalsy();
  });
  it('should be valid for lists with >5 non-leading wildcards', () => {
    component.granuleListModel.set({
      list: 'S1A, S1B, S1C, S1D, S1E, S1F, S1G',
    });
    expect(component.granuleListForm().invalid()).toBeFalsy();
  });
});
