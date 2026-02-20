export enum SBASOverlap {
  HALF_OVERLAP = '50% Overlap Threshold',
  ANY_OVERLAP = 'Any Overlap Threshold',
  ALL = 'No Overlap Threshold',
}

export const SBASOverlapTranslation: Record<SBASOverlap, string> = {
  [SBASOverlap.HALF_OVERLAP]: 'OVERLAP_THRESHOLD_50_PERCENT',
  [SBASOverlap.ANY_OVERLAP]: 'OVERLAP_THRESHOLD_ANY',
  [SBASOverlap.ALL]: 'OVERLAP_THRESHOLD_NONE',
};
