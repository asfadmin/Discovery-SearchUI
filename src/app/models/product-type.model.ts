
const productTypes = [{
    platform: 'ALOS PALSAR',
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'RTC_HI_RES',
    displayName: 'Hi-Res Terrain Corrected'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'METADATA',
    displayName: 'XML and Log Data'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'L1.5',
    displayName: 'Level 1.5 Image'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'L1.0',
    displayName: 'Level 1.0'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'RTC_LOW_RES',
    displayName: 'Low-Res Terrain Corrected'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'INTERFEROMETRY',
    displayName: '(BETA) HDF5 InSAR Product'
  }, {
    platform: 'ALOS PALSAR',
    apiValue: 'L1.1',
    displayName: 'Level 1.1 Complex'
  }, {
    platform: 'AIRSAR',
    apiValue: 'CTIF',
    displayName: 'C-Band JPG'
  }, {
    platform: 'AIRSAR',
    apiValue: 'JPG',
    displayName: 'JPG'
  }, {
    platform: 'AIRSAR',
    apiValue: 'ATI',
    displayName: 'Along-Track Interferometry'
  }, {
    platform: 'AIRSAR',
    apiValue: 'PTIF',
    displayName: 'P-Band JPG'
  }, {
    platform: 'AIRSAR',
    apiValue: 'LTIF',
    displayName: 'L-Band JPG'
  }, {
    platform: 'AIRSAR',
    apiValue: 'LSTOKES',
    displayName: 'L-Band Compressed Stokes Matrix'
  }, {
    platform: 'AIRSAR',
    apiValue: 'PSTOKES',
    displayName: 'P-Band Compressed Stokes Matrix'
  }, {
    platform: 'AIRSAR',
    apiValue: 'CSTOKES',
    displayName: 'C-Band DEM & Compressed Stokes Matrix'
  }, {
    platform: 'AIRSAR',
    apiValue: 'DEM',
    displayName: 'DEM'
  }, {
    platform: 'ERS-1',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'ERS-1',
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    platform: 'ERS-1',
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    platform: 'ERS-1',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'ERS-2',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'ERS-2',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'ERS-2',
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    platform: 'ERS-2',
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    platform: 'JERS-1',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'JERS-1',
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    platform: 'JERS-1',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'JERS-1',
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    platform: 'RADARSAT-1',
    apiValue: 'L0',
    displayName: 'Level Zero'
  }, {
    platform: 'RADARSAT-1',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'RADARSAT-1',
    apiValue: 'L1',
    displayName: 'Level One Image'
  }, {
    platform: 'RADARSAT-1',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_SLC',
    displayName: 'XML Metadata (SLC)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'GRD_MD',
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'GRD_FD',
    displayName: 'L1 Detected Full-Res Dual-Pol (GRD-FD)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'OCN',
    displayName: 'L2 Ocean (OCN)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'SLC',
    displayName: 'L1 Single Look Complex (SLC)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'GRD_HS',
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'RAW',
    displayName: 'L0 Raw Data (RAW)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_GRD_MS',
    displayName: 'XML Metadata (GRD-MS)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'GRD_MS',
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_OCN',
    displayName: 'XML Metadata (OCN)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_GRD_FD',
    displayName: 'XML Metadata (GRD-FD)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_GRD_HD',
    displayName: 'XML Metadata (GRD-HD)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_RAW',
    displayName: 'XML Metadata (RAW)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'GRD_HD',
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_GRD_HS',
    displayName: 'XML Metadata (GRD-HS)'
  }, {
    platform: 'Sentinel-1A',
    apiValue: 'METADATA_GRD_MD',
    displayName: 'XML Metadata (GRD-MD)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_GRD_HS',
    displayName: 'XML Metadata (GRD-HS)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_GRD_MD',
    displayName: 'XML Metadata (GRD-MD)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_RAW',
    displayName: 'XML Metadata (RAW)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_OCN',
    displayName: 'XML Metadata (OCN)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'GRD_MS',
    displayName: 'L1 Detected Mid-Res Single-Pol (GRD-MS)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'GRD_HD',
    displayName: 'L1 Detected High-Res Dual-Pol (GRD-HD)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'GRD_MD',
    displayName: 'L1 Detected Mid-Res Dual-Pol (GRD-MD)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'RAW',
    displayName: 'L0 Raw Data (RAW)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'OCN',
    displayName: 'L2 Ocean (OCN)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_GRD_MS',
    displayName: 'XML Metadata (GRD-MS)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_SLC',
    displayName: 'XML Metadata (SLC)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'SLC',
    displayName: 'L1 Single Look Complex (SLC)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'METADATA_GRD_HD',
    displayName: 'XML Metadata (GRD-HD)'
  }, {
    platform: 'Sentinel-1B',
    apiValue: 'GRD_HS',
    displayName: 'L1 Detected High-Res Single-Pol (GRD-HS)'
  }, {
    platform: 'SMAP',
    apiValue: 'L1A_Radar_RO_QA',
    displayName: 'L1A Radar Receive Only Data Quality'
  }, {
    platform: 'SMAP',
    apiValue: 'L1C_S0_HiRes_QA',
    displayName: 'L1C S0 HiRes Data Quality Information'
  }, {
    platform: 'SMAP',
    apiValue: 'L1A_Radar_RO_ISO_XML',
    displayName: 'L1A Radar Receive Only Product Metadata'
  }, {
    platform: 'SMAP',
    apiValue: 'L1C_S0_HiRes_HDF5',
    displayName: 'L1C S0 HiRes Product'
  }, {
    platform: 'SMAP',
    apiValue: 'L1A_Radar_QA',
    displayName: 'L1A Radar Data Quality Information'
  }, {
    platform: 'SMAP',
    apiValue: 'L1B_S0_LoRes_ISO_XML',
    displayName: 'L1B S0 LoRes Metadata'
  }, {
    platform: 'SMAP',
    apiValue: 'L1B_S0_LoRes_QA',
    displayName: 'L1B S0 LoRes Data Quality Information'
  }, {
    platform: 'SMAP',
    apiValue: 'L1B_S0_LoRes_HDF5',
    displayName: 'L1B S0 LoRes Product'
  }, {
    platform: 'SMAP',
    apiValue: 'L1A_Radar_RO_HDF5',
    displayName: 'L1A Radar Receive Only Product'
  }, {
    platform: 'SMAP',
    apiValue: 'L1C_S0_HiRes_ISO_XML',
    displayName: 'L1C S0 HiRes Metadata'
  }, {
    platform: 'SMAP',
    apiValue: 'L1A_Radar_HDF5',
    displayName: 'L1A Radar Product'
  }, {
    platform: 'SEASAT',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'SEASAT',
    apiValue: 'GEOTIFF',
    displayName: 'Level One GeoTIFF product'
  }, {
    platform: 'SEASAT',
    apiValue: 'L1',
    displayName: 'Level One HDF5 Image'
  }, {
    platform: 'SEASAT',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'UAVSAR',
    apiValue: 'KMZ',
    displayName: 'GoogleEarth KMZ'
  }, {
    platform: 'UAVSAR',
    apiValue: 'INC',
    displayName: 'Incidence angle'
  }, {
    platform: 'UAVSAR',
    apiValue: 'INTERFEROMETRY_GRD',
    displayName: 'Ground Projected Interferogram'
  }, {
    platform: 'UAVSAR',
    apiValue: 'HD5',
    displayName: 'HDF5'
  }, {
    platform: 'UAVSAR',
    apiValue: 'SLOPE',
    displayName: 'Slope'
  }, {
    platform: 'UAVSAR',
    apiValue: 'AMPLITUDE_GRD',
    displayName: 'Ground Projected Amplitude'
  }, {
    platform: 'UAVSAR',
    apiValue: 'INTERFEROMETRY',
    displayName: 'Interferogram'
  }, {
    platform: 'UAVSAR',
    apiValue: 'THUMBNAIL',
    displayName: 'Thumbnail Image'
  }, {
    platform: 'UAVSAR',
    apiValue: 'BROWSE',
    displayName: 'Browse Image'
  }, {
    platform: 'UAVSAR',
    apiValue: 'AMPLITUDE',
    displayName: 'Amplitude'
  }, {
    platform: 'UAVSAR',
    apiValue: 'PROJECTED_ML5X5',
    displayName: 'Ground Projected Complex, 5X5 Resampled'
  }, {
    platform: 'UAVSAR',
    apiValue: 'METADATA',
    displayName: 'Annotation file / Metadata'
  }, {
    platform: 'UAVSAR',
    apiValue: 'DEM_TIFF',
    displayName: 'GEOTIFF Height File'
  }, {
    platform: 'UAVSAR',
    apiValue: 'STOKES',
    displayName: 'Compressed Stokes Matrix'
  }, {
    platform: 'UAVSAR',
    apiValue: 'PROJECTED',
    displayName: 'Ground Projected Complex'
  }, {
    platform: 'UAVSAR',
    apiValue: 'PAULI',
    displayName: 'Pauli Decomposition'
  }, {
    platform: 'UAVSAR',
    apiValue: 'COMPLEX',
    displayName: 'Multi-look Complex'
  }
];
