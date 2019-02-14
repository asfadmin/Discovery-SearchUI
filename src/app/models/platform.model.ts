export interface Platform {
  name: string;
  date: DateRange;
  productTypes: ProductType[];
  beamModes: string[];
  polarizations: string[];
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export interface PlatformProductType {
  productType: ProductType;
  platform: string;
}

export interface ProductType {
  displayName: string;
  apiValue: string;
}

export interface PlatformProductTypes {
  [platformName: string]: ProductType[];
}

export const platforms: Platform[] = [{
  name: 'Sentinel-1A',
  date: { start: new Date(2014, 3, 25) },
  productTypes: [{
    apiValue: 'METADATA_SLC',
    displayName: 'XML Metadata (SLC)'
  }, {
    apiValue: 'GRD_MD',
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)'
  }, {
    apiValue: 'GRD_FD',
    displayName: 'L1 Detected Full-Res Dual-Pol (GRD-FD)'
  }, {
    apiValue: 'OCN',
    displayName: 'L2 Ocean (OCN)'
  }, {
    apiValue: 'SLC',
    displayName: 'L1 Single Look Complex (SLC)'
  }, {
    apiValue: 'GRD_HS',
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)'
  }, {
    apiValue: 'RAW',
    displayName: 'L0 Raw Data (RAW)'
  }, {
    apiValue: 'METADATA_GRD_MS',
    displayName: 'XML Metadata (GRD-MS)'
  }, {
    apiValue: 'GRD_MS',
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)'
  }, {
    apiValue: 'METADATA_OCN',
    displayName: 'XML Metadata (OCN)'
  }, {
    apiValue: 'METADATA_GRD_FD',
    displayName: 'XML Metadata (GRD-FD)'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'METADATA_GRD_HD',
    displayName: 'XML Metadata (GRD-HD)'
  }, {
    apiValue: 'METADATA_RAW',
    displayName: 'XML Metadata (RAW)'
  }, {
    apiValue: 'GRD_HD',
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
  }, {
    apiValue: 'METADATA_GRD_HS',
    displayName: 'XML Metadata (GRD-HS)'
  }, {
    apiValue: 'METADATA_GRD_MD',
    displayName: 'XML Metadata (GRD-MD)'
  }],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ],
  polarizations: [
    'Dual HH',
    'Dual HV',
    'Dual VH',
    'Dual VV',
    'HH',
    'HH+HV',
    'VV',
    'VV+VH',
  ]
}, {
  name: 'Sentinel-1B',
  date: { start: new Date(2016, 3, 3) },
  productTypes: [{
    apiValue: 'METADATA_GRD_HS',
    displayName: 'XML Metadata (GRD-HS)'
  }, {
    apiValue: 'METADATA_GRD_MD',
    displayName: 'XML Metadata (GRD-MD)'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'METADATA_RAW',
    displayName: 'XML Metadata (RAW)'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'METADATA_OCN',
    displayName: 'XML Metadata (OCN)'
  }, {
    apiValue: 'GRD_MS',
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)'
  }, {
    apiValue: 'GRD_HD',
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
  }, {
    apiValue: 'GRD_MD',
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)'
  }, {
    apiValue: 'RAW',
    displayName: 'L0 Raw Data (RAW)'
  }, {
    apiValue: 'OCN',
    displayName: 'L2 Ocean (OCN)'
  }, {
    apiValue: 'METADATA_GRD_MS',
    displayName: 'XML Metadata (GRD-MS)'
  }, {
    apiValue: 'METADATA_SLC',
    displayName: 'XML Metadata (SLC)'
  }, {
    apiValue: 'SLC',
    displayName: 'L1 Single Look Complex (SLC)'
  }, {
    apiValue: 'METADATA_GRD_HD',
    displayName: 'XML Metadata (GRD-HD)'
  }, {
    apiValue: 'GRD_HS',
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)'
  }],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ],
  polarizations: [
    'HH',
    'HH+HV',
    'VV',
    'VV+VH',
  ]
}, {
  name: 'SMAP',
  date: { start: new Date(2015, 0, 15) },
  productTypes: [{
    apiValue: 'L1A_Radar_RO_QA',
    displayName: 'L1A Radar Receive Only Data Quality'
  }, {
    apiValue: 'L1C_S0_HiRes_QA',
    displayName: 'L1C S0 HiRes Data Quality Information'
  }, {
    apiValue: 'L1A_Radar_RO_ISO_XML',
    displayName: 'L1A Radar Receive Only Product Metadata'
  }, {
    apiValue: 'L1C_S0_HiRes_HDF5',
    displayName: 'L1C S0 HiRes Product'
  }, {
    apiValue: 'L1A_Radar_QA',
    displayName: 'L1A Radar Data Quality Information'
  }, {
    apiValue: 'L1B_S0_LoRes_ISO_XML',
    displayName: 'L1B S0 LoRes Metadata'
  }, {
    apiValue: 'L1B_S0_LoRes_QA',
    displayName: 'L1B S0 LoRes Data Quality Information'
  }, {
    apiValue: 'L1B_S0_LoRes_HDF5',
    displayName: 'L1B S0 LoRes Product'
  }, {
    apiValue: 'L1A_Radar_RO_HDF5',
    displayName: 'L1A Radar Receive Only Product'
  }, {
    apiValue: 'L1C_S0_HiRes_ISO_XML',
    displayName: 'L1C S0 HiRes Metadata'
  }, {
    apiValue: 'L1A_Radar_HDF5',
    displayName: 'L1A Radar Product'
  }],
  beamModes: [ 'STD' ],
  polarizations: []
}, {
  name: 'UAVSAR',
  date: { start: new Date(2008, 0, 1) },
  productTypes: [{
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    apiValue: 'INC',
    displayName: 'Incidence angle'
  }, {
    apiValue: 'INTERFEROMETRY_GRD',
    displayName: 'Ground Projected Interferogram'
  }, {
    apiValue: 'HD5',
    displayName: 'HDF5'
  }, {
    apiValue: 'SLOPE',
    displayName: 'Slope'
  }, {
    apiValue: 'AMPLITUDE_GRD',
    displayName: 'Ground Projected Amplitude'
  }, {
    apiValue: 'INTERFEROMETRY',
    displayName: 'Interferogram'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'AMPLITUDE',
    displayName: 'Amplitude'
  }, {
    apiValue: 'PROJECTED_ML5X5',
    displayName: 'Ground Projected Complex, 5X5 Resampled'
  }, {
    apiValue: 'METADATA',
    displayName: 'Annotation file / Metadata'
  }, {
    apiValue: 'DEM_TIFF',
    displayName: 'GEOTIFF Height File'
  }, {
    apiValue: 'STOKES',
    displayName: 'Compressed Stokes Matrix'
  }, {
    apiValue: 'PROJECTED',
    displayName: 'Ground Projected Complex'
  }, {
    apiValue: 'PAULI',
    displayName: 'Pauli Decomposition'
  }, {
    apiValue: 'COMPLEX',
    displayName: 'Multi-look Complex'
  }],
  beamModes: [ 'POL', 'RPI' ],
  polarizations: [
    'Full',
    'HH'
  ]
}, {
  name: 'ALOS PALSAR',
  date: {
    start: new Date(2006, 0, 1),
    end: new Date(2011, 0, 1)
  },
  productTypes: [{
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    apiValue: 'RTC_HI_RES',
    displayName: 'Hi-Res Terrain Corrected'
  }, {
    apiValue: 'METADATA',
    displayName: 'XML and Log Data'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L1.5',
    displayName: 'Level 1.5 Image'
  }, {
    apiValue: 'L1.0',
    displayName: 'Level 1.0'
  }, {
    apiValue: 'RTC_LOW_RES',
    displayName: 'Low-Res Terrain Corrected'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'INTERFEROMETRY',
    displayName: '(BETA) HDF5 InSAR Product'
  }, {
    apiValue: 'L1.1',
    displayName: 'Level 1.1 Complex'
  }],
  beamModes: [],
  polarizations: [
    'HH',
    'HH 3scan',
    'HH 4scan',
    'HH 5scan',
    'HH+HV',
    'UNKNOWN',
    'VV',
    'VV+VH',
    'quadrature',
  ]
}, {
  name: 'RADARSAT-1',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2008, 0, 1)
  },
  productTypes: [{
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }],
  beamModes: [
    'EH3', 'EH4', 'EH6', 'EL1', 'FN1', 'FN2', 'FN3', 'FN4',
    'FN5', 'SNA', 'SNB', 'ST1', 'ST2', 'ST3', 'ST4', 'ST5',
    'ST6', 'ST7', 'SWA', 'SWB', 'WD1', 'WD2', 'WD3'
  ],
  polarizations: [
    'HH'
  ]
}, {
  name: 'ERS-2',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2011, 0, 1)
  },
  productTypes: [{
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'VV'
  ]
}, {
  name: 'JERS-1',
  date: {
    start: new Date(1992, 0, 1),
    end: new Date(1998, 0, 1)
  },
  productTypes: [{
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ]
}, {
  name: 'ERS-1',
  date: {
    start: new Date(1991, 0, 1),
    end: new Date(1997, 0, 1)
  },
  productTypes: [{
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'VV'
  ]
}, {
  name: 'AIRSAR',
  date: {
    start: new Date(1990, 0, 1),
    end: new Date(2004, 0, 1)
  },
  productTypes: [{
    apiValue: 'CTIF',
    displayName: 'C-Band JPG'
  }, {
    apiValue: 'JPG',
    displayName: 'JPG'
  }, {
    apiValue: 'ATI',
    displayName: 'Along-Track Interferometry'
  }, {
    apiValue: 'PTIF',
    displayName: 'P-Band JPG'
  }, {
    apiValue: 'LTIF',
    displayName: 'L-Band JPG'
  }, {
    apiValue: 'LSTOKES',
    displayName: 'L-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'PSTOKES',
    displayName: 'P-Band Compressed Stokes Matrix'
  }, {
    apiValue: 'CSTOKES',
    displayName: 'C-Band DEM & Compressed Stokes Matrix'
  }, {
    apiValue: 'DEM',
    displayName: 'DEM'
  }],
  beamModes: [ '3FP', 'ATI', 'XTI' ],
  polarizations: [
    'Full'
  ]
}, {
  name: 'SEASAT',
  date: {
    start: new Date(1978, 0, 1),
    end: new Date(1978, 0, 1)
  },
  productTypes: [{
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    apiValue: 'GEOTIFF',
    displayName: 'Level One GeoTIFF product'
  }, {
    apiValue: 'L1',
    displayName: 'Level One HDF5 Image'
  }, {
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }],
  beamModes: [ 'STD' ],
  polarizations: [
    'HH'
  ]
}];

export const platformNames = platforms.map(platform => platform.name);

export const flightDirections = [
  'Ascending',
  'Descending'
];
