import { TestBed } from '@angular/core/testing';

import { BrowseOverlayService } from './browse-overlay.service';
import { provideMockStore } from '@ngrx/store/testing';


describe('BrowseOverlayService', () => {
  let service: BrowseOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [provideMockStore({})],
    });
    service = TestBed.inject(BrowseOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should replace NISAR L1 RSLC browse urls with L2 GSLC browse', () => {
    const L1ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L1_RSLC_BETA_V1/NISAR_L1_PR_RSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001/NISAR_L1_PR_RSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001.png'
    const L2ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L2_GSLC_BETA_V1/NISAR_L2_PR_GSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001/NISAR_L2_PR_GSLC_088_039_D_114_2005_SHSH_A_20251114T222008_20251114T222017_T05000_N_P_J_001.png'
    expect(service.nisarL1ToL2BrowseImage(L1ProductUrl)).toBe(L2ProductUrl)
  });

  it('should replace NISAR L1 RUNW browse urls with L2 GUNW browse', () => {
    const L1ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L1_RUNW_BETA_V1/NISAR_L1_PR_RUNW_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_N_P_J_001/NISAR_L1_PR_RUNW_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_N_P_J_001.png'
    const L2ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L2_GUNW_BETA_V1/NISAR_L2_PR_GUNW_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_N_P_J_001/NISAR_L2_PR_GUNW_039_002_D_121_040_7700_SH_20240403T084849_20240403T084905_20240415T084849_20240415T084905_T00408_N_P_J_001.png'
    expect(service.nisarL1ToL2BrowseImage(L1ProductUrl)).toBe(L2ProductUrl)
  });

    it('should replace NISAR L1 ROFF browse urls with L2 GOFF browse', () => {
    const L1ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L1_ROFF_BETA_V1/NISAR_L1_PR_ROFF_039_002_D_122_040_7700_SH_20240403T084903_20240403T084938_20240415T084903_20240415T084938_T00408_N_P_J_001/NISAR_L1_PR_ROFF_039_002_D_122_040_7700_SH_20240403T084903_20240403T084938_20240415T084903_20240415T084938_T00408_N_P_J_001.png'
    const L2ProductUrl = 'https://nisar-test.asf.earthdatacloud.nasa.gov/BROWSE/NISAR_L2_GOFF_BETA_V1/NISAR_L2_PR_GOFF_039_002_D_122_040_7700_SH_20240403T084903_20240403T084938_20240415T084903_20240415T084938_T00408_N_P_J_001/NISAR_L2_PR_GOFF_039_002_D_122_040_7700_SH_20240403T084903_20240403T084938_20240415T084903_20240415T084938_T00408_N_P_J_001.png'
    expect(service.nisarL1ToL2BrowseImage(L1ProductUrl)).toBe(L2ProductUrl)
  });

    it('should not modify NISAR L1 browse images `/assets/no-browse.png`', () => {
    const noBrowse = '/assets/no-browse.png'
    expect(service.nisarL1ToL2BrowseImage(noBrowse)).toBe(noBrowse)
  });
});
