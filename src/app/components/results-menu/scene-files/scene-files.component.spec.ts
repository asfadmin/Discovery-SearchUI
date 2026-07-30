import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SceneFilesComponent } from './scene-files.component';
import { ToastrModule } from 'ngx-toastr';
import { MockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { productFactory } from '@testing/product-factory';
import testProviders from '@testing/providers';
import { nisar, sentinel_1 } from '@models/datasets';
import * as models from '@models';
import * as scenesStore from '@store/scenes';
import { ProductService } from '@services';
import { SAVER } from '@services/saver.provider';

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
      providers: [...testProviders],
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

describe('SceneFilesComponent file grouping', () => {
  let component: SceneFilesComponent;
  let fixture: ComponentFixture<SceneFilesComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SceneFilesComponent,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
        }),
      ],
      providers: [...testProviders, { provide: SAVER, useValue: vi.fn() }],
    });

    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const buildNisarProduct = (
    id: string,
    productTypeDisplay: string,
  ): models.CMRProduct => {
    const productService = TestBed.inject(ProductService);
    const product = productFactory
      .withBasicInfo(id)
      .withDatasetFull(nisar)
      .build();

    return {
      ...product,
      id,
      productTypeDisplay,
      productTypeGroup: productService.productTypeToGroup(
        product,
        productTypeDisplay,
      ),
    };
  };

  const setup = async (
    scene: models.CMRProduct | null,
    products: models.CMRProduct[],
  ) => {
    store.overrideSelector(scenesStore.getSelectedScene, scene);
    store.overrideSelector(scenesStore.getSelectedSceneProducts, products);

    vi.useFakeTimers();
    fixture = TestBed.createComponent(SceneFilesComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    // Advance fake timers so the debounced streams flush deterministically
    await vi.advanceTimersByTimeAsync(120);
    vi.useRealTimers();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const buildNisarSceneWithFiles = () => {
    const base = buildNisarProduct('test-nisar-scene', 'L2 GSLC HDF5');
    const subproducts = [
      'Runconfig YAML',
      'ISO Metadata XML',
      'Browse Image PNG',
      'QA Summary CSV',
      'QA Report PDF',
      'QA Statistics HDF5',
      'Log File',
      'Bin File',
    ].map((display, i) => buildNisarProduct(`subproduct-${i}`, display));
    const scene = {
      ...base,
      metadata: { ...base.metadata, subproducts },
    };

    return { scene, products: [scene, ...subproducts] };
  };

  it('buckets NISAR files into groups, ungrouped files in default', async () => {
    const { scene, products } = buildNisarSceneWithFiles();
    await setup(scene, products);

    expect(component.groups()).toEqual([
      'default',
      'Metadata',
      'Visualizations',
      'Documentation',
    ]);

    const displaysIn = (group: string) =>
      component.selectedSceneGroups()[group].map((p) => p.productTypeDisplay);

    expect(displaysIn('default')).toEqual(['L2 GSLC HDF5', 'Bin File']);
    expect(displaysIn('Metadata')).toEqual([
      'Runconfig YAML',
      'ISO Metadata XML',
      'QA Summary CSV',
      'QA Report PDF',
      'QA Statistics HDF5',
    ]);
    expect(displaysIn('Visualizations')).toEqual(['Browse Image PNG']);
    expect(displaysIn('Documentation')).toEqual(['Log File']);
  });

  it('renders ungrouped files in an expanded Data panel and a panel per non-empty group', async () => {
    const { scene, products } = buildNisarSceneWithFiles();
    await setup(scene, products);

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-scene-group-file')).toHaveLength(
      products.length,
    );
    expect(element.querySelectorAll('mat-expansion-panel')).toHaveLength(4);

    const dataPanel = element.querySelector('mat-expansion-panel');
    const dataHeader = dataPanel.querySelector('mat-panel-title').textContent;
    expect(dataHeader).toContain('Data');
    expect(dataHeader).toContain('(2');
    expect(
      dataPanel
        .querySelector('mat-expansion-panel-header')
        .classList.contains('mat-expanded'),
    ).toBe(true);
    expect(dataPanel.querySelectorAll('app-scene-group-file')).toHaveLength(2);

    const headers = [...element.querySelectorAll('mat-panel-title')].map(
      (title) => title.textContent,
    );
    expect(headers[1]).toContain('Metadata');
    expect(headers[1]).toContain('(5');
  });

  it('does not render panels for empty groups', async () => {
    const base = buildNisarProduct('test-nisar-scene', 'L2 GSLC HDF5');
    const subproduct = buildNisarProduct('subproduct-0', 'Runconfig YAML');
    const scene = {
      ...base,
      metadata: { ...base.metadata, subproducts: [subproduct] },
    };
    await setup(scene, [scene, subproduct]);

    expect(
      fixture.nativeElement.querySelectorAll('mat-expansion-panel'),
    ).toHaveLength(2);
  });

  it('keeps the flat file list for non-NISAR scenes', async () => {
    const scene = productFactory
      .withBasicInfo('test-s1-scene')
      .withDatasetFull(sentinel_1)
      .build();
    await setup(scene, [scene]);

    expect(component.groups()).toBe(null);
    expect(fixture.nativeElement.querySelector('mat-accordion')).toBe(null);
    expect(
      fixture.nativeElement.querySelectorAll('app-scene-file'),
    ).toHaveLength(1);
  });

  it('does not crash when no scene is selected', async () => {
    await setup(null, []);

    expect(component.groups()).toBe(null);
    expect(fixture.nativeElement.querySelector('mat-accordion')).toBe(null);
  });
});
