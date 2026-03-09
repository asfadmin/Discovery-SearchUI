import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneFilesComponent } from './scene-files.component';
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

describe('SceneFilesComponent', () => {
  let component: SceneFilesComponent;
  let fixture: ComponentFixture<SceneFilesComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SceneFilesComponent,
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
    fixture = TestBed.createComponent(SceneFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should be able to generate params for L2 GSLC equivalent of L1 RSLC products', () =>
    expect(
      component.getNisarL2Params(
        'NISAR_L1_PR_RSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001',
        'RSLC',
      ),
    ).toEqual({
      granule_list:
        'NISAR_L2_PR_GSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001',
    }));
  it('should be able to generate params for L2 GUNW equivalent of L1 RUNW products', () =>
    expect(
      component.getNisarL2Params(
        'NISAR_L1_PR_RUNW_015_156_A_010_016_2000_SV_20230619T000803_20230619T000817_20230701T000803_20230701T000817_T00406_N_P_J_001',
        'RUNW',
      ),
    ).toEqual({
      granule_list:
        'NISAR_L2_PR_GUNW_015_156_A_010_016_2000_SV_20230619T000803_20230619T000817_20230701T000803_20230701T000817_T00406_N_P_J_001',
    }));
  it('should be able to generate params for L2 GOFF equivalent of L1 ROFF products', () =>
    expect(
      component.getNisarL2Params(
        'NISAR_L1_PR_ROFF_039_002_D_123_040_4000_SH_20240403T084941_20240403T084954_20240415T084941_20240415T084954_T00408_N_P_J_001',
        'ROFF',
      ),
    ).toEqual({
      granule_list:
        'NISAR_L2_PR_GOFF_039_002_D_123_040_4000_SH_20240403T084941_20240403T084954_20240415T084941_20240415T084954_T00408_N_P_J_001',
    }));
  it('should be able to generate params for L2 UR equivalent of L1 UR products', () =>
    expect(
      component.getNisarL2Params(
        'NISAR_L1_UR_ROFF_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_F_P_J_001',
        'ROFF',
      ),
    ).toEqual({
      granule_list:
        'NISAR_L2_UR_GOFF_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_F_P_J_001',
    }));
});
