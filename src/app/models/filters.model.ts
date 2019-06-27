export enum Props {
  DATE = 'Date',
  BEAM_MODE = 'Beam Mode',
  PATH = 'Path',
  FRAME = 'Frame',
  FLIGHT_DIRECTION = 'Flight Direction',
  POLARIZATION = 'Polarization',
  ABSOLUTE_ORBIT = 'Absolut Orbit',
  MISSION_NAME = 'Mission Name',
  FLIGHT_LINE = 'Flight Line',
  OFF_NADIR_ANGLE = 'Off Nadir Angle',
  FARADAY_ROTATION = 'Faraday Rotation',
  STACK_SIZE = 'Stack Size',
  BASELINE_TOOL = 'Baseline Tool',
}

export const apiParamNames = {
  [Props.PATH]: 'relativeOrbit',
  [Props.FRAME]: 'frame',
};

export const allDatasets = [
  'SENTINEL-1', 'S1 BETA', 'SMAP', 'UAVSAR', 'ALOS PALSAR', 'RADARSAT-1', 'ERS', 'JERS-1', 'AIRSAR', 'SEASAT'
];

const allExcept = datasets =>
  allDatasets.filter(v => !datasets.includes(v));

export const datasetProperties = {
  [Props.DATE]:  [...allDatasets],
  [Props.BEAM_MODE]: [...allDatasets],
  [Props.PATH]: [
    ...allExcept(['UAVSAR', 'AIRSAR', 'SMAP'])
  ],
  [Props.FRAME]: [
    ...allExcept(['UAVSAR', 'AIRSAR', 'SMAP', 'S1 BETA'])
  ],
  [Props.FLIGHT_DIRECTION]: [
    ...allExcept(['AIRSAR'])
  ],
  [Props.POLARIZATION]: [
    ...allExcept(['AIRSAR', 'SMAP', 'S1 BETA'])
  ],
  [Props.ABSOLUTE_ORBIT]: [
    ...allExcept(['AIRSAR', 'UAVSAR', 'S1 BETA'])
  ],
  [Props.MISSION_NAME]: ['UAVSAR', 'AIRSAR', 'S1 BETA'],
  [Props.FLIGHT_LINE]: ['AIRSAR'],
  [Props.OFF_NADIR_ANGLE]: ['ALOS PALSAR'],
  [Props.FARADAY_ROTATION]: ['ALOS PALSAR'],
  [Props.BASELINE_TOOL]: ['SENTINEL-1', 'ALOS PALSAR', 'RADARSAT-1', 'ERS' ],
};
