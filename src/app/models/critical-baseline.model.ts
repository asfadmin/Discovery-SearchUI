import { alos, sentinel1a, sentinel1b, radarsat1 } from './critical-baselines';

import { CMRProduct } from './cmr-product.model';

const criticalBaselines = {
  'ALOS': alos, // Beam -> offNadirAngle
  'SENTINEL-1A': sentinel1a, // Beam -> Pol
  'SENTINEL-1B': sentinel1b, // Beam -> Pol
  'RADARSAT-1': radarsat1, // Beam
  'ERS-1': 1061,
  'ERS-2': 1061,
  'JERS-1': 6201,
};

export const criticalBaselineFor = (product: CMRProduct): number => {
  const dataset = product.dataset.toUpperCase();
  const metadata = product.metadata;

  if (dataset.includes('ALOS')) {
    const beamMode = metadata.beamMode;
    const offNadirAngle = metadata.offNadirAngle;

    return criticalBaselines[dataset][beamMode][offNadirAngle];
  } else if (dataset.includes('SENTINEL')) {
    const beamMode = metadata.beamMode;
    const polarization = metadata.polarization;

    return criticalBaselines[dataset][beamMode][polarization];
  } else if (dataset.includes('RADARSAT-1')) {
    const beamMode = metadata.beamMode;

    return criticalBaselines[dataset][beamMode];
  } else if (dataset.includes('ERS') || dataset.includes('JERS')) {
    return criticalBaselines[dataset];
  } else {
    return null;
  }
};
