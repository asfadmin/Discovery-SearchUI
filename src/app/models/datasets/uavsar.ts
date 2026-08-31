import { Props } from '../filters.model';

export const uavsar = {
  id: 'UAVSAR',
  name: 'UAVSAR',
  subName: '',
  beta: false,
  properties: [Props.DATE, Props.MISSION_NAME],
  apiValue: { dataset: 'UAVSAR' },
  date: { start: new Date('2008/04/28 21:10:16 UTC') },
  infoUrl: 'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/',
  citationUrl:
    'https://asf.alaska.edu/data-sets/sar-data-sets/uavsar/#uavsar_cite',
  frequency: 'L-Band',
  source: {
    name: 'NASA',
    url: 'https://www.nasa.gov/',
  },
  productTypes: [
    {
      apiValue: 'POLSAR',
      displayName: 'Polarimetric Synthetic Aperture Radar (POLSAR)',
    },
    {
      apiValue: 'RPI',
      displayName: 'Repeat Pass Interferometry (RPI)',
    },
  ],
  beamModes: [],
  polarizations: [],
  platforms: [],
  description: 'UAVSAR_DESC',
  icon: '/assets/icons/flight_black_48dp.svg',
  productTypeDisplays: {
    displays: {
      mlc: 'Multi-look Complex',
      grd: 'Ground Projected Complex',
      int: 'Slant Range Interferogram',
      unw: 'Slant Range Unwrapped Phase',
      cor: 'Slant Range Correlation',
      amp1: 'Slant Range Amplitude 1st Pass',
      amp2: 'Slant Range Amplitude 2nd Pass',

      'unw.grd': 'GRD Unwrapped Phase',
      'int.grd': 'GRD Interferogram',
      'cor.grd': 'GRD Correlation',
      'amp1.grd': 'GRD Amplitude 1st Pass',
      'amp2.grd': 'GRD Amplitude 2nd Pass',
      'hgt.grd': 'GRD DEM',

      'int.kmz': 'GRD Interferogram KMZ',
      'unw.kmz': 'GRD Unwrapped Phase KMZ',
      'cor.kmz': 'GRD Correlation KMZ',
      'amp1.kmz': 'GRD Amplitude 1st Pass KMZ',
      'amp2.kmz': 'GRD Amplitude 2nd Pass KMZ',
      'hgt.kmz': 'GRD DEM KMZ',
      't1.slc': 'Single Look Complex 1st Pass',
      't2.slc': 'Single Look Complex 2nd Pass',

      'int.png': 'GRD Interferogram Browse Image PNG',
      'unw.png': 'GRD Unwrapped Browse Image PNG',
      'cor.png': 'GRD Correlation Browse Image PNG',
      'amp1.png': 'GRD Amplitude 1st Pass Browse Image PNG',
      'amp2.png': 'GRD Amplitude 2nd Pass Browse Image PNG',
      'hgt.png': 'GRD DEM Browse Image PNG',

      dat: 'Compressed Stokes Matrix',
      hgt: 'GEOTIFF Height File',
      inc: 'Incidence Angle',
      slope: 'Slope',
      kmz: 'GoogleEarth KMZ',
      gif: 'Browse Image GIF',
      png: 'Browse Image PNG',
      ann: 'Annotation file / Metadata',
      end: 'Figure out',
    },
  },
};
