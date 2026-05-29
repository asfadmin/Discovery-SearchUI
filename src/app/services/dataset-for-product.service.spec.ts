import { TestBed } from '@angular/core/testing';

import * as models from '@models';
import { productFactory } from '@testing/product-factory';
import { beforeEach, describe, expect, it } from 'vitest';
import { alos } from '@models/datasets';

import { DatasetForProductService } from './dataset-for-product.service';

describe('DatasetForProductService', () => {
  let service: DatasetForProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetForProductService);
  });

  describe('match()', () => {
    it('returns alos for ALOS dataset without AVNIR-2 instrument', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withDatasetFull(alos)
        .withPartialCMRProductMetadata({ instrument: null })
        .build();
      expect(service.match(product)).toBe(models.alos);
    });

    it('returns avnir for ALOS dataset with AVNIR-2 instrument', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProduct({
          dataset: 'ALOS',
        })
        .withPartialCMRProductMetadata({
          instrument: 'AVNIR-2',
        })
        .build();
      expect(service.match(product)).toBe(models.avnir);
    });

    it('returns sentinel_1_bursts for BURST product type', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProductMetadata({ productType: 'BURST' })
        .build();
      expect(service.match(product)).toBe(models.sentinel_1_bursts);
    });

    it('returns tropo for TROPO-ZENITH product type', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProductMetadata({ productType: 'TROPO-ZENITH' })
        .build();
      expect(service.match(product)).toBe(models.tropo);
    });

    it('returns tropo for ECMWF_TROPO product type', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProductMetadata({ productType: 'ECMWF_TROPO' })
        .build();
      expect(service.match(product)).toBe(models.tropo);
    });

    it('returns opera_s1 for OPERA product id', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProduct({ id: 'OPERA_L2_RTC-S1_T001' })
        .build();
      expect(service.match(product)).toBe(models.opera_s1);
    });

    it('returns SENTINEL-1 INTERFEROGRAM (BETA) for S1-GUNW name', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProduct({
          name: 'S1-GUNW-D-N-123456-123456-HH-R-N-0001',
        })
        .build();
      expect(service.match(product)).toBe(
        models.datasets['SENTINEL-1 INTERFEROGRAM (BETA)'],
      );
    });

    it('returns sentinel-1 dataset for exact SENTINEL-1 dataset match', () => {
      const product = productFactory.withBasicInfo('test-scene').build();
      expect(service.match(product)).toBe(models.datasets['SENTINEL-1']);
    });

    it('returns sentinel-1 dataset for Sentinel-1A via partial match', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProduct({ dataset: 'Sentinel-1A' })
        .build();
      expect(service.match(product)).toBe(models.datasets['SENTINEL-1']);
    });
    // TODO: Change this to default to SENTINEL-1 again?
    it('returns NISAR for non matching dataset', () => {
      const product = productFactory
        .withBasicInfo('test-scene')
        .withPartialCMRProduct({ dataset: '' })
        .build();
      expect(service.match(product)).toBe(models.datasets.NISAR);
    });
  });
});
