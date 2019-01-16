import { Component, OnInit } from '@angular/core';

import { faDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  public downloadIcon = faDownload;

  public product = {
    'absoluteOrbit': '23512',
    'baselinePerp': 'NA',
    'beamMode': 'IW',
    'beamModeType': 'IW',
    'beamSwath': 'NA',
    'browse': 'https://datapool.asf.alaska.edu/BROWSE/SB/S1B_EW_GRDM_1SDH_20170108T192334_20170108T192434_003761_00676D_4E7B.jpg',
    'catSceneId': 'NA',
    'centerLat': '21.0916',
    'centerLon': '-88.2222',
    'collectionName': 'NA',
    'configurationName': 'Interferometric Wide. 250 km swath, 5 m x 20 m spatial resolution and burst synchronization for interferometry. IW is considered to be the standard mode over land masses.',
    'doppler': '0',
    'downloadUrl': 'https://datapool.asf.alaska.edu/RAW/SA/S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931.zip',
    'farEndLat': '20.2455',
    'farEndLon': '-86.8604',
    'farStartLat': '19.969900000000003',
    'farStartLon': '-89.1883',
    'faradayRotation': 'NA',
    'fileName': 'S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931.zip',
    'finalFrame': '422',
    'firstFrame': '422',
    'flightDirection': 'ASCENDING',
    'flightLine': 'NA',
    'formatName': 'NA',
    'frameNumber': '64',
    'frequency': 'NA',
    'granuleName': 'S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931',
    'granuleType': 'SENTINEL_1A_FRAME',
    'groupID': 'S1A_IWDV_0064_0070_023512_165',
    'incidenceAngle': 'NA',
    'insarGrouping': 'NA',
    'insarStackSize': 'NA',
    'lookDirection': 'R',
    'masterGranule': 'NA',
    'missionName': 'NA',
    'nearEndLat': '22.2039',
    'nearEndLon': '-87.23920000000001',
    'nearStartLat': '21.930400000000002',
    'nearStartLon': '-89.59870000000001',
    'offNadirAngle': 'NA',
    'percentCoherence': 'NA',
    'percentTroposphere': 'NA',
    'percentUnwrapped': 'NA',
    'platform': 'Sentinel-1A',
    'polarization': 'VV+VH',
    'processingDate': '2018-09-01T23:59:36.000000',
    'processingDescription': 'Sentinel-1A SAR raw signal data product',
    'processingLevel': 'RAW',
    'processingType': 'L0',
    'processingTypeDisplay': 'L0 Raw Data (RAW)',
    'productName': 'S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931',
    'product_file_id': 'S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931_RAW',
    'relativeOrbit': '165',
    'sarSceneId': 'NA',
    'sceneDate': '2018-09-02T00:00:08.000000',
    'sceneDateString': 'NA',
    'sceneId': 'S1A_IW_RAW__0SDV_20180901T235936_20180902T000008_023512_028F62_4931',
    'sensor': 'SENTINEL-1 C-SAR',
    'bytes': 1540.3174047470093 * 1000000,
    'slaveGranule': 'NA',
    'startTime': '2018-09-01T23:59:36.000000',
    'status': 'NA',
    'stopTime': '2018-09-02T00:00:08.000000',
    'stringFootprint': 'POLYGON((-86.860400 20.245500,-89.188300 19.969900,-89.598700 21.930400,-87.239200 22.203900,-86.860400 20.245500))',
    'thumbnailUrl': 'NA',
    'track': '165',
    'varianceTroposphere': 'NA'
  };

  constructor() { }

  ngOnInit(): void {
  }

  public getReadableSize(size: number): string {
    const bytes = size;
    const decimals = 2;

    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals || 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const numUnits = String((bytes / Math.pow(k, i)).toFixed(dm));
    const unit = sizes[i];

    return `${numUnits} ${unit}`;
  }
}
