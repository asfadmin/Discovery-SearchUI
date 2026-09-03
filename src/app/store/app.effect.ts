import { ChartsEffects } from './charts';
import { FiltersEffects } from './filters';
import { Hyp3Effects } from './hyp3';
import { MapEffects } from './map';
import { QueueEffects } from './queue';
import { ScenesEffects } from './scenes';
import { SearchEffects } from './search';
import { UIEffects } from './ui';
import { UserEffects } from './user';

export const appEffects = [
  FiltersEffects,
  SearchEffects,
  QueueEffects,
  ScenesEffects,
  UIEffects,
  UserEffects,
  Hyp3Effects,
  MapEffects,
  ChartsEffects,
];
