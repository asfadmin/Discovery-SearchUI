import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideMockStore } from '@ngrx/store/testing';
import { initState as filtersInit } from '@store/filters/filters.reducer';
import { initState as scenesInit } from '@store/scenes/scenes.reducer';
import { initState as userInit } from '@store/user/user.reducer';
import { initState as queueInit } from '@store/queue/queue.reducer';
import { initState as hyp3Init } from '@store/hyp3/hyp3.reducer';
import { initState as searchInit } from '@store/search/search.reducer';
import { provideTranslateService } from '@ngx-translate/core';
import { GranuleListSelectorComponent } from './granule-list-selector.component';

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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideTranslateService(),
        // we'd need to do this for any component that needed store access.
        provideMockStore({
          initialState: {
            filters: filtersInit,
            scenes: scenesInit,
            user: userInit,
            queue: queueInit,
            hyp3: hyp3Init,
            search: searchInit,
          },
        }),
      ],
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
