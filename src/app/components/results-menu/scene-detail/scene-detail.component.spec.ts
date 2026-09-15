import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore } from '@ngrx/store/testing';
import { ToastrModule } from 'ngx-toastr';
import { beforeEach, describe, expect, it } from 'vitest';

import { nisar, sentinel_1 } from '@models/datasets';
import * as scenesStore from '@store/scenes';
import { productFactory } from '@testing/product-factory';
import testProviders from '@testing/providers';

import { SceneDetailComponent } from './scene-detail.component';

describe('SceneDetailComponent', () => {
  let component: SceneDetailComponent;
  let fixture: ComponentFixture<SceneDetailComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SceneDetailComponent,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-right',
        }),
      ],
      providers: [...testProviders],
    });

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SceneDetailComponent);
    component = fixture.componentInstance;
  });

  const nisarProductsTypes = [
    'SME2',
    'GSLC',
    'GOFF',
    'GUNW',
    'GCOV',
    'RSLC',
    'RIFG',
    'ROFF',
    'RUNW',
    'RRSD',
  ];

  it.each(nisarProductsTypes)(
    'sets productTypeDocsUrl for NISAR scenes with productType %s',
    (productType) => {
      const nisarScene = productFactory
        .withBasicInfo('test-nisar-scene')
        .withDatasetFull(nisar)
        .withMetadata({ productType })
        .build();

      store.overrideSelector(scenesStore.getSelectedScene, nisarScene);
      store.refreshState();

      fixture.detectChanges();

      expect(component.productTypeDocsUrl).toBe(
        `https://nisar-docs.asf.alaska.edu/${productType.toLowerCase()}/`,
      );
    },
  );

  it('sets productTypeDocsUrl to null for non-NISAR scenes', () => {
    const sentinelScene = productFactory
      .withBasicInfo('test-sentinel-scene')
      .withDatasetFull(sentinel_1)
      .build();

    store.overrideSelector(scenesStore.getSelectedScene, sentinelScene);
    store.refreshState();

    fixture.detectChanges();

    expect(component.productTypeDocsUrl).toBeNull();
  });

  describe('nisar calibration label', () => {
    const selectNisarScene = (crid: string | null) => {
      const scene = productFactory
        .withBasicInfo('test-nisar-scene')
        .withDatasetFull(nisar)
        .withMetadata({
          nisar: {
            additionalUrls: [],
            s3Urls: [],
            frameCoverage: '',
            jointObservation: '',
            sideBandPolarization: [],
            mainBandPolarization: [],
            rangeBandwidth: '',
            crid,
          },
        })
        .build();

      store.overrideSelector(scenesStore.getSelectedScene, scene);
      store.refreshState();
      fixture.detectChanges();
    };

    it.each([
      ['X05010', 'UNCALIBRATED'],
      ['X05022', 'UNCALIBRATED'],
      ['X05023', 'PROVISIONAL'],
      ['X06001', 'PROVISIONAL'],
      [null, 'UNCALIBRATED'],
    ])('labels NISAR scenes with crid %s as %s', (crid, label) => {
      selectNisarScene(crid as string | null);

      expect(component.nisarCalibration()?.label).toBe(label);
    });

    it('returns no label for non-NISAR scenes', () => {
      const sentinelScene = productFactory
        .withBasicInfo('test-sentinel-scene')
        .withDatasetFull(sentinel_1)
        .build();

      store.overrideSelector(scenesStore.getSelectedScene, sentinelScene);
      store.refreshState();
      fixture.detectChanges();

      expect(component.nisarCalibration()).toBeNull();
    });
  });
});
