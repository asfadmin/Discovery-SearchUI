export interface Platform {
  name: string;
  date: DateRange;
  types: string[];
  beamModes: string[];
}

export interface DateRange {
  start: Date;
  end?: Date;
}

export const platforms: Platform[] = [{
  name: 'Sentinel-1A',
  date: { start: new Date(2014, 3, 25) },
  types: [
    'L0 Raw Data (RAW)',
    'L1 Detected Full-Res Dual-Pol (GRD-FD)',
    'L1 Detected High-Res Dual-Pol (GRD-HD)',
    'L1 Detected High-Res Single-Pol (GRD-HS)',
    'L1 Detected Mid-Res Dual-Pol (GRD-MD)',
    'L1 Detected Mid-Res Single-Pol (GRD-MS)',
    'L1 Single Look Complex (SLC)',
    'L2 Ocean (OCN)',
  ],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'Sentinel-1B',
  date: { start: new Date(2016, 3, 3) },
  types: [
    'L0 Raw Data (RAW)',
    'L1 Detected Full-Res Dual-Pol (GRD-FD)',
    'L1 Detected High-Res Dual-Pol (GRD-HD)',
    'L1 Detected High-Res Single-Pol (GRD-HS)',
    'L1 Detected Mid-Res Dual-Pol (GRD-MD)',
    'L1 Detected Mid-Res Single-Pol (GRD-MS)',
    'L1 Single Look Complex (SLC)',
    'L2 Ocean (OCN)',
  ],
  beamModes: [
    'EW', 'IW', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'WV'
  ]
}, {
  name: 'SMAP',
  date: { start: new Date(2015, 0, 15) },
  types: [
    'L1A Radar Product',
    'L1B S0 LoRes Product',
    'L1C S0 HiRes Product'
  ],
  beamModes: [ 'STD' ]
}, {
  name: 'UAVSAR',
  date: { start: new Date(2008, 0, 1) },
  types: [
    'Amplitude',
    'Compressed Stokes Matrix',
    'Ground Projected Amplitude',
    'Ground Projected Complex',
    'Ground Projected Complex, 3X3 Resampled',
    'Ground Projected Complex, 5X5 Resampled',
    'Ground Projected Interferogram',
    'HDF5',
    'Interferogram',
    'Multi-look Complex'
  ],
  beamModes: [ 'POL', 'RPI' ]
}, {
  name: 'ALOS PALSAR',
  date: {
    start: new Date(2006, 0, 1),
    end: new Date(2011, 0, 1)
  },
  types: [
    'Level 1.0',
    'Level 1.1 Complex',
    'Level 1.5 Image',
  ], beamModes: []
}, {
  name: 'RADARSAT-1',
  date: {
    start: new Date(1995, 0, 1),
    end: new Date(2008, 0, 1)
  },
  types: [
    'Level Zero',
    'Level One Image'
  ],
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
  types: [
    'Level Zero',
    'Level One Image' ],
  beamModes: [ 'STD' ]
}, {
  name: 'JERS-1',
  date: {
    start: new Date(1992, 0, 1),
    end: new Date(1998, 0, 1)
  },
  types: [
    'Level Zero',
    'Level One Image'
  ],

  beamModes: [ 'STD' ]
}, {
  name: 'ERS-1',
  date: {
    start: new Date(1991, 0, 1),
    end: new Date(1997, 0, 1)
  },
  types: [
    'Level Zero',
    'Level One Image'
  ],
  beamModes: [ 'STD' ]
}, {
  name: 'AIRSAR',
  date: {
    start: new Date(1990, 0, 1),
    end: new Date(2004, 0, 1)
  },
  types: [
    '3-Frequency Polarimetry',
    'Along-Track Interferometry',
    'C-Band DEM & Compressed Stokes Matrix',
    'C-Band JPG',
    'JPG',
    'L-Band Compressed Stokes Matrix',
    'L-Band JPG',
    'P-Band Compressed Stokes Matrix',
    'P-Band JPG'
  ],
  beamModes: [ '3FP', 'ATI', 'XTI' ]
}, {
  name: 'SEASAT',
  date: {
    start: new Date(1978, 0, 1),
    end: new Date(1978, 0, 1)
  },
  types: [ 'Level One GeoTIFF product' ],
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
