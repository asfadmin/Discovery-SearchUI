export interface Platform {
  name: string;
  date: DateRange;
  types: ProductType[];
  beamModes: string[];
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export interface ProductType {
  name: string;
  apiName: string;
}

export const platforms: Platform[] = [{
  name: 'Sentinel-1A',
  date: { start: new Date(2014, 3, 25) },
  types: [{
    name: 'L0 Raw Data (RAW)', apiName: 'RAW',
  }, {
    name: 'L1 Detected Full-Res Dual-Pol (GRD-FD)', apiName: 'GRD_FD',
  }, {
    name: 'L1 Detected High-Res Dual-Pol (GRD-HD)', apiName: 'GRD_HD',
  }, {
    name: 'L1 Detected High-Res Single-Pol (GRD-HS)', apiName: 'GRD_HS',
  }, {
    name: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)', apiName: 'GRD_MD',
  }, {
    name: 'L1 Detected Mid-Res Single-Pol (GRD-MS)', apiName: 'GRD_MS',
  }, {
    name: 'L1 Single Look Complex (SLC)', apiName: 'SLC',
  }, {
    name: 'L2 Ocean (OCN)', apiName: 'OCN',
  }],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'Sentinel-1B',
  date: { start: new Date(2016, 3, 3) },
  types: [{
    name: 'L0 Raw Data (RAW)', apiName: 'RAW',
  }, {
    name: 'L1 Detected Full-Res Dual-Pol (GRD-FD)', apiName: 'GRD_FD',
  }, {
    name: 'L1 Detected High-Res Dual-Pol (GRD-HD)', apiName: 'GRD_HD',
  }, {
    name: 'L1 Detected High-Res Single-Pol (GRD-HS)', apiName: 'GRD_HS',
  }, {
    name: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)', apiName: 'GRD_MD',
  }, {
    name: 'L1 Detected Mid-Res Single-Pol (GRD-MS)', apiName: 'GRD_MS',
  }, {
    name: 'L1 Single Look Complex (SLC)', apiName: 'SLC',
  }, {
    name: 'L2 Ocean (OCN)', apiName: 'OCN',
  }  ],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'SMAP',
  date: { start: new Date(2015, 0, 15) },
  types: [{
    /*
 L1A_Radar_RO_QA,
 L1B_S0_LoRes_HDF5 === L1B S0 LoRes Product,
 L1B_S0_LoRes_QA,
 L1B_S0_LoRes_ISO_XML,
 L1A_Radar_QA,
 L1A_Radar_RO_ISO_XML,
 L1C_S0_HiRes_ISO_XML,
 L1C_S0_HiRes_QA,
 L1C_S0_HiRes_HDF5 === L1C S0 HiRes Product,
 L1A_Radar_HDF5 === L1A Radar Product
     */
    name: 'L1A Radar Product', apiName: 'L1A_Radar_HDF5 ',
  }, {
    name: 'L1B S0 LoRes Product', apiName:  'L1B_S0_LoRes_HDF5'
  }, {
    name: 'L1C S0 HiRes Product', apiName:  'L1C_S0_HiRes_HDF5 '
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'UAVSAR',
  date: { start: new Date(2008, 0, 1) },
  types: [{

/*
 KMZ,
 PAULI,
 BROWSE,
 DEM_TIFF,
 METADATA,
 THUMBNAIL
 */
    name: 'Amplitude', apiName: 'AMPLITUDE'
  }, {
    name: 'Compressed Stokes Matrix', apiName: 'STOKES',
  }, {
    name: 'Ground Projected Amplitude', apiName: 'AMPLITUDE_GRD'
  }, {
    name: 'Ground Projected Complex', apiName: 'PROJECTED'
  }, {
    name: 'Ground Projected Complex, 3X3 Resampled', apiName: 'PROJECTED_ML3X3'
  }, {
    name: 'Ground Projected Complex, 5X5 Resampled', apiName: 'PROJECTED_ML5X5'
  }, {
    name: 'Ground Projected Interferogram', apiName: 'INTERFEROMETRY_GRD'
  }, {
    name: 'HDF5', apiName: '???'
  }, {
    name: 'Interferogram', apiName: 'INTERFEROMETRY'
  }, {
    name: 'Multi-look Complex', apiName: 'COMPLEXE'
  }],
  beamModes: [ 'POL', 'RPI' ]
}, {
  name: 'ALOS PALSAR',
  date: {
    start: new Date(2006, 0, 1),
    end: new Date(2011, 0, 1)
  },
  types: [{
    name: 'Level 1.0', apiName: 'L1.0'
  }, {
    name: 'Level 1.1 Complex', apiName: 'L1.1'
  }, {
    name: 'Level 1.5 Image', apiName: 'L1.5'
  }],
  beamModes: []
}, {
  name: 'RADARSAT-1',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2008, 0, 1)
  },
  types: [{
    name: 'Level Zero', apiName: 'L0'
  }, {
    name: 'Level One Image', apiName: 'L1'
  }],
  beamModes: [
    'EH3', 'EH4', 'EH6', 'EL1', 'FN1', 'FN2', 'FN3', 'FN4',
    'FN5', 'SNA', 'SNB', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5',
    'ST6', 'ST7', 'SWA', 'SWB', 'WD1', 'WD2', 'WD3'
  ]
}, {
  name: 'ERS-2',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2011, 0, 1)
  },
  types: [{
    name: 'Level Zero', apiName: 'L0'
  }, {
    name: 'Level One Image', apiName: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'JERS-1',
  date: {
    start: new Date(1992, 0, 1),
    end: new Date(1998, 0, 1)
  },
  types: [{
    name: 'Level Zero', apiName: 'L0'
  }, {
    name: 'Level One Image', apiName: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'ERS-1',
  date: {
    start: new Date(1991, 0, 1),
    end: new Date(1997, 0, 1)
  },
  types: [{
    name: 'Level Zero', apiName: 'L0'
  }, {
    name: 'Level One Image', apiName: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'AIRSAR',
  date: {
    start: new Date(1990, 0, 1),
    end: new Date(2004, 0, 1)
  },
  types: [{
    /*
     3FP,
     ATI,
     LTIF,
     PTIF,
     CTIF,
     PSTOKES,
     BROWSE,
     DEM,
     CSTOKES,
     JPG,
     LSTOKES,
     THUMBNAIL
     */
    name: '3-Frequency Polarimetry', apiName: '3FP'
  }, {
    name: 'Along-Track Interferometry', apiName: 'ATI'
  }, {
    name: 'C-Band DEM & Compressed Stokes Matrix', apiName: 'CSTOKES'
  }, {
    name: 'C-Band JPG', apiName: 'CTIF'
  }, {
    name: 'JPG', apiName: 'JPG'
  }, {
    name: 'L-Band Compressed Stokes Matrix', apiName: 'LSTOKES'
  }, {
    name: 'L-Band JPG', apiName: 'LTIF'
  }, {
    name: 'P-Band Compressed Stokes Matrix', apiName: 'PSTOKES'
  }, {
    name: 'P-Band JPG', apiName: 'PTIF'
  }],
  beamModes: [ '3FP', 'ATI', 'XTI' ]
}, {
  name: 'SEASAT',
  date: {
    start: new Date(1978, 0, 1),
    end: new Date(1978, 0, 1)
  },
  types: [{
    name: 'Level One GeoTIFF product' , apiName: 'L1'
  }],
  beamModes: [ 'STD' ]
}];

export const platformNames = platforms.map(platform => platform.name);

export const polarizations = [
  'VV',
  'HH',
  'VV+VH',
  'HH+HV',
  'Dual HH',
  'Dual HV',
  'Dual VV',
  'Dual VH',
  'Quadrature'
];

export const flightDirections = [
  'Ascending',
  'Descending'
];
