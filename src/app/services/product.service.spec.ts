import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import * as models from '@models';
import { beforeEach, describe, expect, it } from 'vitest';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should parse old links correctly', () => {
    const url =
      'https://datapool.asf.alaska.edu/RTC/OPERA-S1/OPERA_L2_RTC-S1_T001-000189-IW2_20211028T180924Z_20250703T015334Z_S1A_30_v1.0_VH.tif';
    expect(
      service.urlToProductType(url, models.opera_s1.productTypeDisplays),
    ).toBe('VH');
  });
  it('should parse h5 cumulus link', () => {
    const url =
      'https://cumulus.asf.earthdatacloud.nasa.gov/OPERA/OPERA_L2_RTC-S1/OPERA_L2_RTC-S1_T139-297356-IW2_20250929T054926Z_20251002T213318Z_S1C_30_v1.0/OPERA_L2_RTC-S1_T139-297356-IW2_20250929T054926Z_20251002T213318Z_S1C_30_v1.0_VH.tif';
    expect(
      service.urlToProductType(url, models.opera_s1.productTypeDisplays),
    ).toBe('VH');
  });
  it('should parse a base download url', () => {
    const url =
      'https://cumulus.asf.earthdatacloud.nasa.gov/OPERA/OPERA_L2_RTC-S1/OPERA_L2_RTC-S1_T140-299545-IW1_20250929T073003Z_20251003T012020Z_S1C_30_v1.0/OPERA_L2_RTC-S1_T140-299545-IW1_20250929T073003Z_20251003T012020Z_S1C_30_v1.0.h5';
    expect(
      service.urlToProductType(url, models.opera_s1.productTypeDisplays),
    ).toBe('h5');
  });
  it('should parse links with more than one word', () => {
    const datapool =
      'https://datapool.asf.alaska.edu/RTC-STATIC/OPERA-S1/OPERA_L2_RTC-S1-STATIC_T144-308004-IW3_20140403_S1A_30_v1.0_number_of_looks.tif';
    const cumulus =
      'https://cumulus.asf.earthdatacloud.nasa.gov/OPERA/OPERA-S1/OPERA_L2_RTC-S1-STATIC_T144-308004-IW3_20140403_S1A_30_v1.0_number_of_looks.tif';
    expect(
      service.urlToProductType(datapool, models.opera_s1.productTypeDisplays),
    ).toBe('number_of_looks');
    expect(
      service.urlToProductType(cumulus, models.opera_s1.productTypeDisplays),
    ).toBe('number_of_looks');
  });
  it('should parse xml cumulus link', () => {
    const url =
      'https://cumulus.asf.earthdatacloud.nasa.gov/OPERA/OPERA_L4_TROPO-ZENITH_V1/OPERA_L4_TROPO-ZENITH_20251003T180000Z_20251006T000715Z_HRES_v1.0/OPERA_L4_TROPO-ZENITH_20251003T180000Z_20251006T000715Z_HRES_v1.0.iso.xml';
    expect(
      service.urlToProductType(url, models.opera_s1.productTypeDisplays),
    ).toBe('xml');
  });
  it('should parse netcdf cumulus link', () => {
    const url =
      'https://cumulus.asf.earthdatacloud.nasa.gov/OPERA/OPERA_L4_TROPO-ZENITH_V1/OPERA_L4_TROPO-ZENITH_20251003T180000Z_20251006T000715Z_HRES_v1.0/OPERA_L4_TROPO-ZENITH_20251003T180000Z_20251006T000715Z_HRES_v1.0.nc';
    expect(
      service.urlToProductType(url, models.opera_s1.productTypeDisplays),
    ).toBe('nc');
  });
  it('should parse seasat hdf5 link', () => {
    const url =
      'https://cumulus.asf.earthdatacloud.nasa.gov/SEASAT/SS_01502_STD_F2536/SS_01502_STD_F2536.h5';
    expect(
      service.urlToProductType(url, models.seasat.productTypeDisplays),
    ).toBe('h5');
  });
  it('should parse seasat geotiff s3 link', () => {
    const url =
      'https://cumulus.asf.earhtdatacloud.nasa.gov/SEASAT/SS_01502_STD_F2536/SS_01502_STD_F2536.tif';
    expect(
      service.urlToProductType(url, models.seasat.productTypeDisplays),
    ).toBe('tif');
  });
});
