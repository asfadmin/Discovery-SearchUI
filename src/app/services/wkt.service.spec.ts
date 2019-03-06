import { async } from '@angular/core/testing';
import { WktService } from './wkt.service';

describe('WktService', () => {
  let service: WktService;
  const wkt = 'POLYGON((-43.2 -7.8,-42.9 -6.3,-40.7 -6.8,-41.0 -8.4,-43.2 -7.8))';
  const epsg = 'EPSG:3857';

  beforeEach(() => {
    service = new WktService();
  });

  it('should convert between WKT and openlayers features', async () => {
    const feature = service.wktToFeature(wkt, epsg);

    expect(
      service.featureToWkt(feature, epsg)
    ).toEqual(
      service.featureToWkt(feature.clone(), epsg)
    );
  });
});
