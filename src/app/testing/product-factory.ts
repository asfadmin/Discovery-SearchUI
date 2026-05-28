import { CMRProduct, CMRProductMetadata, FlightDirection } from "@models";
import moment from "moment";

function createProduct(product: CMRProduct): CMRProduct {
  return product;
}

/**
 * Class for building testing products.
 *
 * @method {NestedProductFactory} withBasicInfo - Create a single product for testing utilizing the builder pattern.
 */
export class ProductFactory {
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
        productTypeDisplay: "",
        file: "",
        id: "",
        downloadUrl: "",
        bytes: 100 * 1000000,
        dataset: "SENTINEL-1",
        browses: [],
        thumbnail: "",
        groupId: "",
        isUnzippedFile: false,
        isDummyProduct: false,
        metadata: {
          date: moment(),
          stopDate: moment().add(2),
          polygon: "",

          productType: "",
          beamMode: "",
          polarization: "",
          flightDirection: FlightDirection.ASCENDING,

          path: 0,
          frame: 0,
          absoluteOrbit: [],

          collectionName: "",
          collectionID: "",

          stackSize: 0,
          faradayRotation: 0,
          offNadirAngle: 0,
          instrument: "",
          pointingAngle: "",
          missionName: "",
          flightLine: "",
          perpendicular: 0,
          temporal: 0,
          canInSAR: false,
          burst: undefined,
          opera: undefined,
          nisar: undefined,
          fileName: "",
          job: undefined,
          pgeVersion: "",
          subproducts: [],
          parentID: "",
          ariaVersion: "",
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
export class NestedProductFactory {
  constructor(
    private _product: Readonly<CMRProduct>,
    private _partials: {
      productPart?: Partial<Omit<CMRProduct, "metadata">>;
      metadataPart?: Partial<CMRProductMetadata>;
    }[] = [{}],
  ) {}

  /**
   * Get a product with the specified parameters
   */
  build() {
    const extendChoice = this._partials.pop();
    if (extendChoice === undefined) {
      return null;
    }

    return this.withPartialCMRProduct(
      extendChoice.productPart,
    ).withPartialCMRProductMetadata(extendChoice.metadataPart)._product;
  }

  withAllDatasets(): NestedProductFactory {
    const datasets = [
      "NISAR",
      "Sentinel-1",
      "S1 Bursts",
      "OPERA-S1",
      "TROPO",
      "ALOS-2",
      "ALOS PALSAR",
      "ALOS AVNIR-2",
      "SIR-C",
      "ARIA S1 GUNW",
      "SMAP",
      "UAVSAR",
      "RADARSAT-1",
      "ERS",
      "JERS-1",
      "AIRSAR",
      "SEASAT",
    ];

    return this.withPartialCMRProducts(
      datasets.map((dataset) => {
        return { dataset: dataset };
      }),
    );
  }

  withPartialCMRProducts(
    partials: Iterable<Partial<Omit<CMRProduct, "metadata">>>,
  ): NestedProductFactory {
    if (partials === []) {
      return this;
    }

    const newPartials: {
      productPart?: Partial<Omit<CMRProduct, "metadata">>;
      metadataPart?: Partial<CMRProductMetadata>;
    }[] = [];

    for (const partial of this._partials) {
      for (const newPartial of partials) {
        newPartials.push({
          productPart: { ...partial, ...newPartial },
          metadataPart: partial.metadataPart,
        });
      }
    }

    return new NestedProductFactory(
      {
        ...this._product,
      },
      [...this._partials, ...newPartials],
    );
  }

  withPartialCMRProduct(
    partial: Partial<Omit<CMRProduct, "metadata">>,
  ): NestedProductFactory {
    return this._extendWith(partial);
  }

  withPartialCMRProductMetadata(
    partial: Partial<CMRProductMetadata>,
  ): NestedProductFactory {
    return this._extendWithMetadata(partial);
  }

  private _extendWith(product: Partial<Omit<CMRProduct, "metadata">>) {
    return new NestedProductFactory(
      {
        ...this._product,
        ...product,
      },
      this._partials,
    );
  }

  private _extendWithMetadata(productMetadata: Partial<CMRProductMetadata>) {
    return new NestedProductFactory(
      {
        ...this._product,
        metadata: {
          ...this._product.metadata,
          ...productMetadata,
        },
      },
      this._partials,
    );
  }
}
