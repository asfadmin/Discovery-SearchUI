export interface Platform {
  name: string;
  date: DateRange;
  productTypes: ProductType[];
  beamModes: string[];
}

export interface ProductType {
  displayName: string;
  apiValue: string;
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export interface PlatformProductType {
  productType: ProductType;
  platform: string;
}


export const platforms: Platform[] = [{
  name: 'Sentinel-1A',
  date: { start: new Date(2014, 3, 25) },
  productTypes: [{
    displayName: 'L0 Raw Data (RAW)', apiValue: 'RAW',
  }, {
    displayName: 'L1 Detected Full-Res Dual-Pol (GRD-FD)', apiValue: 'GRD_FD',
  }, {
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)', apiValue: 'GRD_HD',
  }, {
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)', apiValue: 'GRD_HS',
  }, {
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)', apiValue: 'GRD_MD',
  }, {
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)', apiValue: 'GRD_MS',
  }, {
    displayName: 'L1 Single Look Complex (SLC)', apiValue: 'SLC',
  }, {
    displayName: 'L2 Ocean (OCN)', apiValue: 'OCN',
  }],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'Sentinel-1B',
  date: { start: new Date(2016, 3, 3) },
  productTypes: [{
    displayName: 'L0 Raw Data (RAW)', apiValue: 'RAW',
  }, {
    displayName: 'L1 Detected Full-Res Dual-Pol (GRD-FD)', apiValue: 'GRD_FD',
  }, {
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)', apiValue: 'GRD_HD',
  }, {
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)', apiValue: 'GRD_HS',
  }, {
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)', apiValue: 'GRD_MD',
  }, {
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)', apiValue: 'GRD_MS',
  }, {
    displayName: 'L1 Single Look Complex (SLC)', apiValue: 'SLC',
  }, {
    displayName: 'L2 Ocean (OCN)', apiValue: 'OCN',
  }  ],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'SMAP',
  date: { start: new Date(2015, 0, 15) },
  productTypes: [{
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
    displayName: 'L1A Radar Product', apiValue: 'L1A_Radar_HDF5 ',
  }, {
    displayName: 'L1B S0 LoRes Product', apiValue:  'L1B_S0_LoRes_HDF5'
  }, {
    displayName: 'L1C S0 HiRes Product', apiValue:  'L1C_S0_HiRes_HDF5 '
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'UAVSAR',
  date: { start: new Date(2008, 0, 1) },
  productTypes: [{

/*
 KMZ,
 PAULI,
 BROWSE,
 DEM_TIFF,
 METADATA,
 THUMBNAIL
 */
    displayName: 'Amplitude', apiValue: 'AMPLITUDE'
  }, {
    displayName: 'Compressed Stokes Matrix', apiValue: 'STOKES',
  }, {
    displayName: 'Ground Projected Amplitude', apiValue: 'AMPLITUDE_GRD'
  }, {
    displayName: 'Ground Projected Complex', apiValue: 'PROJECTED'
  }, {
    displayName: 'Ground Projected Complex, 3X3 Resampled', apiValue: 'PROJECTED_ML3X3'
  }, {
    displayName: 'Ground Projected Complex, 5X5 Resampled', apiValue: 'PROJECTED_ML5X5'
  }, {
    displayName: 'Ground Projected Interferogram', apiValue: 'INTERFEROMETRY_GRD'
  }, {
    displayName: 'Interferogram', apiValue: 'INTERFEROMETRY'
  }, {
    displayName: 'Multi-look Complex', apiValue: 'COMPLEXE'
  }],
  beamModes: [ 'POL', 'RPI' ]
}, {
  name: 'ALOS PALSAR',
  date: {
    start: new Date(2006, 0, 1),
    end: new Date(2011, 0, 1)
  },
  productTypes: [{
    displayName: 'Level 1.0', apiValue: 'L1.0'
  }, {
    displayName: 'Level 1.1 Complex', apiValue: 'L1.1'
  }, {
    displayName: 'Level 1.5 Image', apiValue: 'L1.5'
  }],
  beamModes: []
}, {
  name: 'RADARSAT-1',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2008, 0, 1)
  },
  productTypes: [{
    displayName: 'Level Zero', apiValue: 'L0'
  }, {
    displayName: 'Level One Image', apiValue: 'L1'
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
  productTypes: [{
    displayName: 'Level Zero', apiValue: 'L0'
  }, {
    displayName: 'Level One Image', apiValue: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'JERS-1',
  date: {
    start: new Date(1992, 0, 1),
    end: new Date(1998, 0, 1)
  },
  productTypes: [{
    displayName: 'Level Zero', apiValue: 'L0'
  }, {
    displayName: 'Level One Image', apiValue: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'ERS-1',
  date: {
    start: new Date(1991, 0, 1),
    end: new Date(1997, 0, 1)
  },
  productTypes: [{
    displayName: 'Level Zero', apiValue: 'L0'
  }, {
    displayName: 'Level One Image', apiValue: 'L1'
  }],
  beamModes: [ 'STD' ]
}, {
  name: 'AIRSAR',
  date: {
    start: new Date(1990, 0, 1),
    end: new Date(2004, 0, 1)
  },
  productTypes: [{
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
    displayName: '3-Frequency Polarimetry', apiValue: '3FP'
  }, {
    displayName: 'Along-Track Interferometry', apiValue: 'ATI'
  }, {
    displayName: 'C-Band DEM & Compressed Stokes Matrix', apiValue: 'CSTOKES'
  }, {
    displayName: 'C-Band JPG', apiValue: 'CTIF'
  }, {
    displayName: 'JPG', apiValue: 'JPG'
  }, {
    displayName: 'L-Band Compressed Stokes Matrix', apiValue: 'LSTOKES'
  }, {
    displayName: 'L-Band JPG', apiValue: 'LTIF'
  }, {
    displayName: 'P-Band Compressed Stokes Matrix', apiValue: 'PSTOKES'
  }, {
    displayName: 'P-Band JPG', apiValue: 'PTIF'
  }],
  beamModes: [ '3FP', 'ATI', 'XTI' ]
}, {
  name: 'SEASAT',
  date: {
    start: new Date(1978, 0, 1),
    end: new Date(1978, 0, 1)
  },
  productTypes: [{
    displayName: 'Level One GeoTIFF product' , apiValue: 'L1'
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
