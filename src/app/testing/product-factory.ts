import {
  CMRProduct,
  CMRProductMetadata,
  Dataset,
  FlightDirection,
} from '@models';
import moment from 'moment';

function createProduct(product: CMRProduct): CMRProduct {
  return product;
}

class ProductFactory {
  withBasicInfo(name: string): NestedProductFactory {
    return new NestedProductFactory(
      createProduct({
        name: name,
        productTypeDisplay: '',
        file: '',
        id: '',
        downloadUrl: '',
        bytes: 100 * 1000000,
        dataset: 'SENTINEL-1',
        browses: [],
        thumbnail: '',
        groupId: '',
        isUnzippedFile: false,
        isDummyProduct: false,
        metadata: {
          date: moment(),
          stopDate: moment().add(2),
          polygon: '',

          productType: '',
          beamMode: '',
          polarization: '',
          flightDirection: FlightDirection.ASCENDING,

          path: 0,
          frame: 0,
          absoluteOrbit: [],

          collectionName: '',
          collectionID: '',

          stackSize: 0,
          faradayRotation: 0,
          offNadirAngle: 0,
          instrument: '',
          pointingAngle: '',
          missionName: '',
          flightLine: '',
          perpendicular: 0,
          temporal: 0,
          canInSAR: false,
          burst: undefined,
          opera: undefined,
          nisar: undefined,
          fileName: '',
          job: undefined,
          pgeVersion: '',
          subproducts: [],
          parentID: '',
          ariaVersion: '',
        },
      }),
    );
  }
}

class NestedProductFactory {
  constructor(private _product: Readonly<CMRProduct>) {}

  build() {
    return this._product;
  }

  withAOI(): NestedProductFactory {
    return this._extendWithMetadata({
      polygon:
        'POLYGON((-124.3885 36.7031,-120.6971 36.7031,-120.6971 38.9246,-124.3885 38.9246,-124.3885 36.7031))',
    });
  }
  withDataset(productDataset: Dataset) {
    return this._extendWith({
      dataset: productDataset.id,
    });
  }

  private _extendWith(product: Partial<CMRProduct>) {
    return new NestedProductFactory({ ...this._product, ...product });
  }
  private _extendWithMetadata(productMetadata: Partial<CMRProductMetadata>) {
    return new NestedProductFactory({
      ...this._product,
      metadata: {
        ...this._product.metadata,
        ...productMetadata,
      },
    });
  }
}

export const productFactory = new ProductFactory();
