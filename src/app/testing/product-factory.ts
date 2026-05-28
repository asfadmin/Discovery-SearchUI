import { CMRProduct, CMRProductMetadata, FlightDirection } from '@models';
import moment from 'moment';

function createProduct(product: CMRProduct): CMRProduct {
  return product;
}

/**
 * Class for building testing products.
 *
 * @method {NestedProductFactory} withBasicInfo - Create a single product for testing utilizing the builder pattern.
 */
class ProductFactory {
  /**
   * Builds products for testing products using the builder pattern.
   *
   * @param {string} name - The name of the product.
   *
   * @example
   * // Returns a mostly blank product named "test"
   * productFactory.withBasicInfo("test")
   * @example
   * // Returns a product with the ALOS dataset specified
   * productFactory.withBasicInfo("test").withDataset("ALOS")
   */
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

/**
 * Builder class for product factory. Use .with<FieldName>(value) to set the value of a products field. Call .build() to receive a product.
 *
 * @example
 * productfactory.withDataset("ALOS").build()
 */
class NestedProductFactory {
  constructor(private _product: Readonly<CMRProduct>) {}

  /**
   * Get a product with the specified parameters
   */
  build() {
    return this._product;
  }

  withAOI(): NestedProductFactory {
    return this._extendWithMetadata({
      polygon:
        'POLYGON((-124.3885 36.7031,-120.6971 36.7031,-120.6971 38.9246,-124.3885 38.9246,-124.3885 36.7031))',
    });
  }

  withName(name: string): NestedProductFactory {
    return this._extendWith({ name });
  }

  withFile(file: string): NestedProductFactory {
    return this._extendWith({ file });
  }

  withId(id: string): NestedProductFactory {
    return this._extendWith({ id });
  }

  withDownloadUrl(downloadUrl: string): NestedProductFactory {
    return this._extendWith({ downloadUrl });
  }

  withBytes(bytes: number): NestedProductFactory {
    return this._extendWith({ bytes });
  }

  withDataset(dataset: string): NestedProductFactory {
    return this._extendWith({ dataset });
  }

  withBrowses(browses: string[]): NestedProductFactory {
    return this._extendWith({ browses });
  }

  withThumbnail(thumbnail: string): NestedProductFactory {
    return this._extendWith({ thumbnail });
  }

  withGroupId(groupId: string): NestedProductFactory {
    return this._extendWith({ groupId });
  }

  withIsUnzippedFile(isUnzippedFile = true): NestedProductFactory {
    return this._extendWith({ isUnzippedFile });
  }

  withIsDummyProduct(isDummyProduct = true): NestedProductFactory {
    return this._extendWith({ isDummyProduct });
  }

  withDate(date: moment.Moment): NestedProductFactory {
    return this._extendWithMetadata({ date });
  }

  withStopDate(stopDate: moment.Moment): NestedProductFactory {
    return this._extendWithMetadata({ stopDate });
  }

  withPolygon(polygon: string): NestedProductFactory {
    return this._extendWithMetadata({ polygon });
  }

  withProductType(productType: string): NestedProductFactory {
    return this._extendWithMetadata({ productType });
  }

  withBeamMode(beamMode: string): NestedProductFactory {
    return this._extendWithMetadata({ beamMode });
  }

  withPolarization(polarization: string): NestedProductFactory {
    return this._extendWithMetadata({ polarization });
  }

  withFlightDirection(flightDirection: FlightDirection): NestedProductFactory {
    return this._extendWithMetadata({ flightDirection });
  }

  withPath(path: number): NestedProductFactory {
    return this._extendWithMetadata({ path });
  }

  withFrame(path: number): NestedProductFactory {
    return this._extendWithMetadata({ path });
  }

  withAbsoluteOrbit(absoluteOrbit: number[]): NestedProductFactory {
    return this._extendWithMetadata({ absoluteOrbit });
  }

  withCollectionName(collectionName: string): NestedProductFactory {
    return this._extendWithMetadata({ collectionName });
  }

  withCollectionID(collectionID: string): NestedProductFactory {
    return this._extendWithMetadata({ collectionID });
  }

  withStackSize(stackSize: number): NestedProductFactory {
    return this._extendWithMetadata({ stackSize });
  }

  withFaradayRotation(faradayRotation: number | null): NestedProductFactory {
    return this._extendWithMetadata({ faradayRotation });
  }

  withOffNadirAngle(offNadirAngle: number | null): NestedProductFactory {
    return this._extendWithMetadata({ offNadirAngle });
  }

  withInstrument(instrument: string | null): NestedProductFactory {
    return this._extendWithMetadata({ instrument });
  }

  withPointingAngle(pointingAngle: string | null): NestedProductFactory {
    return this._extendWithMetadata({ pointingAngle });
  }

  withMissionName(missionName: string | null): NestedProductFactory {
    return this._extendWithMetadata({ missionName });
  }

  withFlightLine(flightLine: string | null): NestedProductFactory {
    return this._extendWithMetadata({ flightLine });
  }

  withPerpendicular(perpendicular: number | null): NestedProductFactory {
    return this._extendWithMetadata({ perpendicular });
  }

  withTemporal(temporal: number | null): NestedProductFactory {
    return this._extendWithMetadata({ temporal });
  }

  withCanInSAR(canInSAR = true): NestedProductFactory {
    return this._extendWithMetadata({ canInSAR });
  }

  withFileName(fileName: string | null): NestedProductFactory {
    return this._extendWithMetadata({ fileName });
  }

  withPgeVersion(pgeVersion: string | null): NestedProductFactory {
    return this._extendWithMetadata({ pgeVersion });
  }

  withParentID(parentID: string): NestedProductFactory {
    return this._extendWithMetadata({ parentID });
  }

  withAriaVersion(ariaVersion: string): NestedProductFactory {
    return this._extendWithMetadata({ ariaVersion });
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
