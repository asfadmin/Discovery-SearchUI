import { GranulesState } from '@store/granules';

import * as models from '@models';

export const granuleState: {granules: GranulesState} = {
  granules: {
    ids: [
      'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.zip',
      'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.iso.xml',
      'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.zip',
      'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml',
      'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.zip',
      'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.iso.xml',
      'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.zip',
      'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.iso.xml',
      'S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1.zip'
    ],
    granules: {
      S1A_EWDH_0321_0334_026292_145: [
        'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.zip',
        'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.zip',
        'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml',
        'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.iso.xml'
      ],
      S1A_EWDH_0321_0334_026291_144: [
        'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.zip',
        'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.zip',
        'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.iso.xml',
        'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.iso.xml'
      ],
      S1A_EWDH_0324_0338_026290_143: [
        'S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1.zip'
      ]
    },
    products: {
      'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.zip': {
        name: 'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43',
        file: 'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.zip',
        bytes: 951909737.5869751,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0321_0334_026292_145',
        metadata: {
          date: new Date('2019-03-11T23:26:06.000Z'),
          polygon: 'POLYGON((-114.598500 76.682700,-130.357700 77.973600,-123.774900 81.936400,-102.964200 80.138500,-114.598500 76.682700))',
          productType: 'RAW',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 145,
          frame: 321,
          absoluteOrbit: 26292
        }
      },
      'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.iso.xml': {
        name: 'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43',
        file: 'S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.iso.xml',
        downloadUrl: 'https://datapool.asf.alaska.edu/METADATA_RAW/SA/S1A_EW_RAW__0SDH_20190311T152606_20190311T152714_026292_02F049_8A43.iso.xml',
        bytes: 39678.57360839844,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0321_0334_026292_145',
        metadata: {
          date: new Date('2019-03-11T23:26:06.000Z'),
          polygon: 'POLYGON((-114.598500 76.682700,-130.357700 77.973600,-123.774900 81.936400,-102.964200 80.138500,-114.598500 76.682700))',
          productType: 'METADATA_RAW',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 145,
          frame: 321,
          absoluteOrbit: 26292
        }
      },
      'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.zip': {
        name: 'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB',
        file: 'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/GRD_MD/SA/S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.zip',
        bytes: 279435605.0491333,
        platform: 'Sentinel-1A',
        browse: 'https://datapool.asf.alaska.edu/BROWSE/SA/S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.jpg',
        groupId: 'S1A_EWDH_0321_0334_026292_145',
        metadata: {
          date: new Date('2019-03-11T23:26:06.000Z'),
          polygon: 'POLYGON((-130.304001 78.301582,-124.000931 82.011322,-102.833107 80.155739,-114.026909 76.923676,-130.304001 78.301582))',
          productType: 'GRD_MD',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 145,
          frame: 321,
          absoluteOrbit: 26292
        }
      },
      'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml': {
        name: 'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB',
        file: 'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml',
        downloadUrl: 'https://datapool.asf.alaska.edu/METADATA_GRD_MD/SA/S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml',
        bytes: 56341.17126464844,
        platform: 'Sentinel-1A',
        browse: 'https://datapool.asf.alaska.edu/BROWSE/SA/S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.jpg',
        groupId: 'S1A_EWDH_0321_0334_026292_145',
        metadata: {
          date: new Date('2019-03-11T23:26:06.000Z'),
          polygon: 'POLYGON((-130.304001 78.301582,-124.000931 82.011322,-102.833107 80.155739,-114.026909 76.923676,-130.304001 78.301582))',
          productType: 'METADATA_GRD_MD',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 145,
          frame: 321,
          absoluteOrbit: 26292
        }
      },
      'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.zip': {
        name: 'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485',
        file: 'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.zip',
        bytes: 981143419.2657471,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0321_0334_026291_144',
        metadata: {
          date: new Date('2019-03-11T21:47:21.000Z'),
          polygon: 'POLYGON((-89.886900 76.695600,-105.659700 77.987400,-99.062100 81.950000,-78.230300 80.150100,-89.886900 76.695600))',
          productType: 'RAW',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 144,
          frame: 321,
          absoluteOrbit: 26291
        }
      },
      'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.iso.xml': {
        name: 'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485',
        file: 'S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.iso.xml',
        downloadUrl: 'https://datapool.asf.alaska.edu/METADATA_RAW/SA/S1A_EW_RAW__0SDH_20190311T134721_20190311T134830_026291_02F03F_3485.iso.xml',
        bytes: 39673.805236816406,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0321_0334_026291_144',
        metadata: {
          date: new Date('2019-03-11T21:47:21.000Z'),
          polygon: 'POLYGON((-89.886900 76.695600,-105.659700 77.987400,-99.062100 81.950000,-78.230300 80.150100,-89.886900 76.695600))',
          productType: 'METADATA_RAW',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 144,
          frame: 321,
          absoluteOrbit: 26291
        }
      },
      'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.zip': {
        name: 'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187',
        file: 'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/GRD_MD/SA/S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.zip',
        bytes: 274719266.8914795,
        platform: 'Sentinel-1A',
        browse: 'https://datapool.asf.alaska.edu/BROWSE/SA/S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.jpg',
        groupId: 'S1A_EWDH_0321_0334_026291_144',
        metadata: {
          date: new Date('2019-03-11T21:47:21.000Z'),
          polygon: 'POLYGON((-105.581696 78.315796,-99.357170 82.029823,-78.149178 80.176613,-89.298958 76.936409,-105.581696 78.315796))',
          productType: 'GRD_MD',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 144,
          frame: 321,
          absoluteOrbit: 26291
        }
      },
      'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.iso.xml': {
        name: 'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187',
        file: 'S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.iso.xml',
        downloadUrl: 'https://datapool.asf.alaska.edu/METADATA_GRD_MD/SA/S1A_EW_GRDM_1SDH_20190311T134721_20190311T134825_026291_02F03F_C187.iso.xml',
        bytes: 56344.032287597656,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0321_0334_026291_144',
        metadata: {
          date: new Date('2019-03-11T21:47:21.000Z'),
          polygon: 'POLYGON((-105.581696 78.315796,-99.357170 82.029823,-78.149178 80.176613,-89.298958 76.936409,-105.581696 78.315796))',
          productType: 'METADATA_GRD_MD',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 144,
          frame: 321,
          absoluteOrbit: 26291
        }
      },
      'S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1.zip': {
        name: 'S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1',
        file: 'S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1.zip',
        downloadUrl: 'https://datapool.asf.alaska.edu/RAW/SA/S1A_EW_RAW__0SDH_20190311T120855_20190311T121003_026290_02F034_00A1.zip',
        bytes: 1061607345.5810547,
        platform: 'Sentinel-1A',
        browse: 'assets/error.png',
        groupId: 'S1A_EWDH_0324_0338_026290_143',
        metadata: {
          date: new Date('2019-03-11T20:08:55.000Z'),
          polygon: 'POLYGON((-67.348800 75.727700,-82.098400 76.929700,-76.626200 80.917900,-57.303500 79.285000,-67.348800 75.727700))',
          productType: 'RAW',
          beamMode: 'EW',
          polarization: 'HH+HV',
          flightDirection: models.FlightDirection.DESCENDING,
          frequency: 'NA',
          path: 143,
          frame: 324,
          absoluteOrbit: 26290
        }
      }
    },
    selected: 'S1A_EW_GRDM_1SDH_20190311T152606_20190311T152710_026292_02F049_D1EB.iso.xml',
    focused: null,
    searchList: []
  }
};
