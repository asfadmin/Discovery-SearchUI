import { Props } from '../filters.model';

export const seasat = {
  id: 'SEASAT',
  name: 'SEASAT',
  subName: '',
  beta: false,
  priority: 170,
  properties: [
    Props.DATE,
    Props.BEAM_MODE,
    Props.PATH,
    Props.FRAME,
    Props.FLIGHT_DIRECTION,
    Props.POLARIZATION,
    Props.ABSOLUTE_ORBIT,
    Props.USE_BEAM_MODE,
  ],
  apiValue: { dataset: 'SEASAT' },
  date: {
    start: new Date('1978/07/04 12:06:00 UTC'),
    end: new Date('1978/10/10 01:29:10 UTC'),
  },
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/',
  },
  infoUrl: 'https://www.earthdata.nasa.gov/data/catalog/asf-seasat-l1-sar-1',
  citationUrl:
    'https://asf.alaska.edu/data-sets/sar-data-sets/seasat/seasat-how-to-cite/',
  productTypes: [],
  beamModes: ['STD'],
  polarizations: ['HH'],
  subtypes: [],
  platformDesc: 'SEASAT_DESC',
  platformIcon: '/assets/icons/satellite_alt_black_48dp.svg',
  productTypeDisplays: {
    h5: 'Level One HDF5 Image',
    in: 'Metadata IN',
    tif: 'Level One GeoTIFF Product',
    xml: 'ISO Metadata XML',
    kml: 'Metadata KML',
    qc_report: 'QC Report',
    jpg: 'Browse Image JPEG',
  },
};
