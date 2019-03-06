import { QueueState } from '@store/queue';
import { FlightDirection } from '@models';

import { testProduct } from './products';

export const queueState: {queue: QueueState} = {
  queue: {
    products: {
      [testProduct.file]: testProduct,
      'S1A_IW_RAW__0SDV_20190306T164334_20190306T164407_026220_02ED9E_1176.zip': {
        name: 'S1A_IW_RAW__0SDV_20190306T164334_20190306T164407_026220_02ED9E_1176',
        file: 'S1A_IW_RAW__0SDV_20190306T164334_20190306T164407_026220_02ED9E_1176.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_IW_RAW__0SDV_20190306T164334_20190306T164407_026220_02ED9E_1176.zip',
        bytes: 1495052038.192749,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_IWDV_0164_0171_026220_073',
        metadata: {
          date: new Date('2019-03-07T01:43:34.000Z'),
          polygon: 'POLYGON((18.031200 50.499200,14.585500 50.206300,13.963300 52.148600,17.559000 52.448200,18.031200 50.499200))',
          productType: 'RAW',
          beamMode: 'IW',
          polarization: 'VV+VH',
          flightDirection: FlightDirection.ASCENDING,
          frequency: 'NA',
          path: 73,
          frame: 164,
          absoluteOrbit: 26220
        }
      },
      'S1A_IW_RAW__0SDV_20190306T164309_20190306T164342_026220_02ED9E_2523.zip': {
        name: 'S1A_IW_RAW__0SDV_20190306T164309_20190306T164342_026220_02ED9E_2523',
        file: 'S1A_IW_RAW__0SDV_20190306T164309_20190306T164342_026220_02ED9E_2523.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_IW_RAW__0SDV_20190306T164309_20190306T164342_026220_02ED9E_2523.zip',
        bytes: 1511852383.6135864,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_IWDV_0159_0166_026220_073',
        metadata: {
          date: new Date('2019-03-07T01:43:09.000Z'),
          polygon: 'POLYGON((18.383800 48.994500,15.043300 48.706100,14.446500 50.650100,17.925000 50.944400,18.383800 48.994500))',
          productType: 'RAW',
          beamMode: 'IW',
          polarization: 'VV+VH',
          flightDirection: FlightDirection.ASCENDING,
          frequency: 'NA',
          path: 73,
          frame: 159,
          absoluteOrbit: 26220
        }
      },
      'S1A_IW_RAW__0SDV_20190306T164219_20190306T164252_026220_02ED9E_89A0.zip': {
        name: 'S1A_IW_RAW__0SDV_20190306T164219_20190306T164252_026220_02ED9E_89A0',
        file: 'S1A_IW_RAW__0SDV_20190306T164219_20190306T164252_026220_02ED9E_89A0.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_IW_RAW__0SDV_20190306T164219_20190306T164252_026220_02ED9E_89A0.zip',
        bytes: 1491562912.940979,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_IWDV_0149_0156_026220_073',
        metadata: {
          date: new Date('2019-03-07T01:42:19.000Z'),
          polygon: 'POLYGON((19.063400 45.983400,15.909400 45.702200,15.355200 47.649200,18.626600 47.934800,19.063400 45.983400))',
          productType: 'RAW',
          beamMode: 'IW',
          polarization: 'VV+VH',
          flightDirection: FlightDirection.ASCENDING,
          frequency: 'NA',
          path: 73,
          frame: 149,
          absoluteOrbit: 26220
        }
      }
    },
    ids: [
      'S1A_IW_RAW__0SDV_20190306T164334_20190306T164407_026220_02ED9E_1176.zip',
      'S1A_IW_RAW__0SDV_20190306T164309_20190306T164342_026220_02ED9E_2523.zip',
      'S1A_IW_RAW__0SDV_20190306T164219_20190306T164252_026220_02ED9E_89A0.zip'
    ]
  }
};
