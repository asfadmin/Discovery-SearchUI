import { CMRProduct, CMRProductMetadata, FlightDirection } from '@models';

import {
  airsar,
  alos,
  ers,
  jers_1,
  radarsat_1,
  seasat,
  sentinel_1,
  smap,
  uavsar,
  beta,
  sirc,
  avnir,
  sentinel_1_bursts,
  opera_s1,
  nisar,
  alos_2,
  tropo,
} from '@models/datasets';

import moment from 'moment';

function createProduct(product: CMRProduct): CMRProduct {
  return product;
}

export class ProductFactory {
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

class SplitPartial {
  productPart?: Partial<Omit<CMRProduct, 'metadata'>>;
  metadataPart?: Partial<CMRProductMetadata>;
}

export class NestedProductFactory {
  constructor(
    private _product: Readonly<CMRProduct>,
    private _partials: SplitPartial[] = [{}],
  ) {}

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
      'NISAR',
      'Sentinel-1',
      'S1 Bursts',
      'OPERA-S1',
      'TROPO',
      'ALOS-2',
      'ALOS PALSAR',
      'ALOS AVNIR-2',
      'SIR-C',
      'ARIA S1 GUNW',
      'SMAP',
      'UAVSAR',
      'RADARSAT-1',
      'ERS',
      'JERS-1',
      'AIRSAR',
      'SEASAT',
    ];

    return this.withPartialCMRProducts(
      datasets.map((dataset) => {
        return { dataset: dataset };
      }),
    );
  }

  withAllDatasetsFull(): NestedProductFactory {
    const partials: SplitPartial[] = [];

    const datasets = [
      airsar,
      alos,
      ers,
      jers_1,
      radarsat_1,
      seasat,
      sentinel_1,
      smap,
      uavsar,
      beta,
      sirc,
      avnir,
      sentinel_1_bursts,
      opera_s1,
      nisar,
      alos_2,
      tropo,
    ];

    for (const dataset of datasets) {
      const baseProductPart: Partial<CMRProduct> = {
        dataset: dataset.apiValue.dataset,
      };
      for (const productType of dataset.productTypes) {
        for (const beamMode of dataset.beamModes) {
          for (const polarization of dataset.polarizations) {
            if (datasets.instruments !== undefined) {
              for (const instrument of dataset.instruments) {
                partials.push({
                  productPart: baseProductPart,
                  metadataPart: {
                    productType: productType.apiValue,
                    beamMode: beamMode,
                    polarization: polarization,
                    instrument: instrument.apiValue,
                  },
                });
              }
            } else {
              partials.push({
                productPart: baseProductPart,
                metadataPart: {
                  productType: productType.apiValue,
                  beamMode: beamMode,
                  polarization: polarization,
                },
              });
            }
          }
        }
      }
    }

    return this._withSplitPartials(partials);
  }

  withBytesRange(
    count: number,
    low = 0,
    high = 100 * 1000000,
  ): NestedProductFactory {
    const stride = Math.floor((high - low) / count);
    const bytes = [...Array(count).keys()].map((v) => {
      return { bytes: stride * v + low };
    });

    return this.withPartialCMRProducts(bytes);
  }

  withPartialCMRProducts(
    partials: Iterable<Partial<Omit<CMRProduct, 'metadata'>>>,
  ): NestedProductFactory {
    const newPartials: SplitPartial[] = [];

    for (const partial of this._partials) {
      for (const newPartial of partials) {
        newPartials.push({
          productPart: { ...partial.productPart, ...newPartial },
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

  withPartialCMRProductMetadatas(
    partials: Iterable<Partial<CMRProductMetadata>>,
  ): NestedProductFactory {
    const newPartials: {
      productPart?: Partial<Omit<CMRProduct, 'metadata'>>;
      metadataPart?: Partial<CMRProductMetadata>;
    }[] = [];

    for (const partial of this._partials) {
      for (const newPartial of partials) {
        newPartials.push({
          productPart: partial.productPart,
          metadataPart: { ...partial.metadataPart, ...newPartial },
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

  _withSplitPartials(
    splitPartials: Iterable<SplitPartial>,
  ): NestedProductFactory {
    const newPartials: SplitPartial[] = [];

    for (const partial of this._partials) {
      for (const newPartial of splitPartials) {
        newPartials.push({
          productPart: { ...partial.productPart, ...newPartial.productPart },
          metadataPart: { ...partial.metadataPart, ...newPartial.metadataPart },
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
    partial: Partial<Omit<CMRProduct, 'metadata'>>,
  ): NestedProductFactory {
    return this._extendWith(partial);
  }

  withPartialCMRProductMetadata(
    partial: Partial<CMRProductMetadata>,
  ): NestedProductFactory {
    return this._extendWithMetadata(partial);
  }

  private _extendWith(product: Partial<Omit<CMRProduct, 'metadata'>>) {
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
