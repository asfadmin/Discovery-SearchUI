export enum Props {
  DATE = 'Date',
  BEAM_MODE = 'Beam Mode',
  PATH = 'Path',
  FRAME = 'Frame',
  FLIGHT_DIRECTION = 'Flight Direction',
  POLARIZATION = 'Polarization',
  ABSOLUTE_ORBIT = 'Absolute Orbit',
  MISSION_NAME = 'Mission Name',
  FLIGHT_LINE = 'Flight Line',
  OFF_NADIR_ANGLE = 'Off Nadir Angle',
  FARADAY_ROTATION = 'Faraday Rotation',
  STACK_SIZE = 'Stack Size',
  BASELINE_TOOL = 'Baseline Tool',
  SUBTYPE = 'Subtype',
  POINTING_ANGLE = 'Pointing Angle',
}

export const apiParamNames = {
  [Props.PATH]: 'relativeOrbit',
  [Props.FRAME]: 'frame',
};
